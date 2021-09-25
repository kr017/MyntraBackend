const Cart = require("../models/cart");
const User = require("../models/user");
const Address = require("../models/address");
const Product = require("../models/product");
const Order = require("../models/order");

const { v4: uuidv4 } = require("uuid");

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
      if (user.stripe_id) {
        charge = await stripe.charges.create(
          {
            amount: parseInt(amount) * 100,
            currency: "INR",
            customer: user.stripe_id,
            shipping: {
              name: user.name,
              address: {
                country: addressId.country,
              },
            },
          },
          { idempotencyKey: uuidv4() }
        );
      } else {
        const customer = await stripe.customers.create({
          email: user.email,
          source: req.body.id,
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
                  country: addressId.country,
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
          payment: { amount: parseInt(amount), receiptUrl: charge.receipt_url },
          products: productsInCart,
          addressId: addressId,
          status: "ACTIVE",
        };
        let order = new Order(data);
        await order.save(data => {
          res.json({
            status: "success",
            msg: "order created!!!",
            data: order,
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
};
