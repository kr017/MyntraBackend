const Cart = require("../models/cart");
const User = require("../models/user");
const Product = require("../models/product");
const moment = require("moment");
module.exports = {
  addOrUpdateCart: async (req, res) => {
    try {
      let userId = req.user._id;
      let cart = await Cart.findOne({ userId });
      let productId = req.body._id;
      const product = await Product.findById({
        _id: productId,
      });
      let cartItem = {
        _id: product,
        quantity: req.body.quantity,
        size: req.body.size,
      };
      console.log(cart);
      console.log(cartItem);
      let products = [];

      if (cart) {
        products = cart.products;
        products.push(cartItem);

        await Cart.findByIdAndUpdate(
          cart._id,
          { userId: userId, products: products, address: req.body.address },
          { new: true }
        );

        res.json({
          status: "success",
          message: "cart updated successfully",
          data: products,
        });
      } else {
        const user = await User.findById({
          _id: userId,
        });
        products.push(cartItem);
        let data = {
          userId: user,
          products: products,
          address: req.body.address,
        };
        let cart = new Cart(data);
        await cart.save(data => {
          res.json({
            status: "success",
            msg: "cart created!!!",
            data: products,
          });
        });
      }
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get product details",
      });
    }
  },

  getProductsFromCart: async (req, res) => {
    try {
      let userId = req.user._id;
      let cart = await Cart.findOne({ userId });
      console.log(cart);
      let products = cart.products;
      let productsInCart = [];
      for (let i = 0; i < products.length; i++) {
        const product = await Product.findById({
          _id: products[i].productId,
        });

        productsInCart.push(product);
      }

      cart = {
        _id: cart._id,
        modifiedOn: cart.modifiedOn,
        products: productsInCart,
        userId: cart.userId,
      };
      res.json({
        status: "success",
        message: "User Cart",
        data: cart,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get products",
      });
    }
  },
};
