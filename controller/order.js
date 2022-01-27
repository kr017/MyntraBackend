const Cart = require("../models/cart");
const User = require("../models/user");
const Address = require("../models/address");
const Product = require("../models/product");
const Order = require("../models/order");
const config = require("../config");
const { v4: uuidv4 } = require("uuid");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const stripe = require("stripe")(
  "sk_test_51JcWeNSIbA2UPd9FD3kUsHFZiwMLL0dkiGI7YhQPE5ShqdnQUawRJ1kh7A9aaNp5L5ai4b5bNkwR0iTasNnE0vRg00pANgc3NV"
);

module.exports = {
  placeOrder: async (req, res) => {
    try {
      let user = await User.findById(req.user._id);
      let amount = 0,
        addressId = "",
        products = [],
        productsInCart = [],
        charge = null;
      if (!req.body.amount || !req.body.addressId || !req.body.products) {
        throw { message: "Please fill all required fields" };
      }
      amount = req.body.amount;
      addressId = await Address.findById({ _id: req.body.addressId });
      products = req.body.products;
      for (let i = 0; i < products.length; i++) {
        const product = await Product.findById({
          _id: products[i]._id,
        });
        productsInCart.push(product);
      }

      // productsInCart=cart.findOne({ userId: req.user._id }).populate('productId');
      if (user.stripe_id) {
        charge = await stripe.charges.create(
          {
            amount: parseInt(amount),
            currency: "INR",
            customer: user.stripe_id,
            shipping: {
              name: user.name,
              address: {
                country: req.body.token.card.country,
              },
            },
          },
          { idempotencyKey: uuidv4() }
        );
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          source: req.body.token.id,
        });

        if (customer) {
          let updatedUser = await User.findByIdAndUpdate(req.user._id, {
            stripe_id: customer.id,
          });

          charge = await stripe.charges.create(
            {
              amount: parseInt(amount) * 100,
              currency: "INR",
              customer: customer.id,
              shipping: {
                name: user.name,
                address: {
                  country: req.body.token.card.country,
                },
              },
            },
            { idempotencyKey: uuidv4() }
          );
        }
      }

      if (charge) {
        let data = {
          userId: req.user._id,
          payment: {
            id: charge.id,
            amount: parseInt(amount),
            receiptUrl: charge.receipt_url,
          },
          products: productsInCart,
          addressId: addressId,
          status: "ACTIVE",
        };

        //
        let userId = user._id;
        let cart = await Cart.findOne({ userId });
        if (cart) {
          let products = cart.products;
          for (let i = 0; i < productsInCart.length; i++) {
            let index = products.findIndex(
              item => item._id === productsInCart[i]._id
            );

            products.splice(index, 1);
          }
          await Cart.findByIdAndUpdate(
            cart._id,
            {
              userId: userId,
              products: products,
            },
            { new: true }
          );
        }

        let order = new Order(data);
        await order.save(data => {
          res.json({
            status: "success",
            msg: "order created!!!",
            data: order,
            status: 200,
          });
        });
      } else {
        throw { message: "Something went wrong" };
      }
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to place order",
      });
    }
  },

  rzpPlaceOrder: async (req, res) => {
    try {
      if (!req.body.amount || !req.body.addressId || !req.body.products) {
        throw { message: "Please fill all required fields" };
      }
      var instance = new Razorpay({
        key_id: config.rzp_key,
        key_secret: config.rzp_secret,
      });
      // instance.invoices.create({
      //   type: "invoice",
      //   date: 1589994898,
      //   customer_id: "cust_E7q0trFqXgExmT",
      //   line_items: [
      //     {
      //       "item_id": "item_DRt61i2NnL8oy6"
      //     }
      //   ]
      // })
      var options = {
        amount: req.body.amount, // amount in the smallest currency unit
        currency: "INR",
        receipt: "order_rcptid_11",
        payment_capture: 1,
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
          return res.send(err);
        } else {
          order.addressId = req.body.addressId;
          order.products = req.body.products;
          return res.json(order);
        }
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to place order",
      });
    }
  },
  rzpPayment: async (req, res) => {
    try {
      let user = await User.findById(req.user._id);
      let amount = 0,
        addressId = "",
        products = [],
        productsInCart = [];
      amount = req.body.amount;
      addressId = await Address.findById({ _id: req.body.addressId });
      products = req.body.products;
      for (let i = 0; i < products.length; i++) {
        const product = await Product.findById({
          _id: products[i]._id,
        });
        productsInCart.push(product);
      }
      const generated_signature = crypto.createHmac(
        "sha256",
        config.rzp_secret
      );
      generated_signature.update(
        req.body.razorpay_order_id + "|" + req.body.transactionid
      );
      if (generated_signature.digest("hex") === req.body.razorpay_signature) {
        let data = {
          userId: req.user._id,
          payment: {
            id: req.body.transactionid,
            amount: parseInt(req.body.transactionamount),
            receiptUrl: null,
          },
          products: productsInCart,
          addressId: addressId,
          status: "ACTIVE",
        };
        let userId = user._id;
        let cart = await Cart.findOne({ userId });
        if (cart) {
          let products = cart.products;
          for (let i = 0; i < productsInCart.length; i++) {
            let index = products.findIndex(
              item => item._id === productsInCart[i]._id
            );

            products.splice(index, 1);
          }
          await Cart.findByIdAndUpdate(
            cart._id,
            {
              userId: userId,
              products: products,
            },
            { new: true }
          );
        }
        let order = new Order(data);
        await order.save(data => {
          res.json({
            status: "success",
            msg: "order created!!!",
            data: order,
            status: 200,
          });
        });
      } else {
        return res.send("failed");
      }
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to place order",
      });
    }
  },

  getOrders: async (req, res) => {
    try {
      let userId = req.user._id;
      let orders = await Order.find({ userId: userId });
      let data = [];
      for (let j = 0; j < orders.length; j++) {
        let productsFromOrder = [];

        let items = orders[j].products;
        for (let i = 0; i < items.length; i++) {
          const product = await Product.findById({
            _id: items[i]._id,
          });
          productsFromOrder.push(product);
        }
        let d = {
          payment: orders[j].payment,
          modifiedOn: orders[j].modifiedOn,
          status: orders[j].status,
          products: productsFromOrder,
        };
        data.push(d);
      }
      res.json({
        status: "success",
        message: "User Orders",
        data: data,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get products",
      });
    }
  },
};
