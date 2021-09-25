const Wishlist = require("../models/wishlist");
const User = require("../models/user");
const Product = require("../models/product");
const moment = require("moment");
module.exports = {
  addProductToWishlist: async (req, res) => {
    try {
      let userId = req.user._id;
      let wishlist = await Wishlist.findOne({ userId });
      let productId = req.body._id;
      const product = await Product.findById({
        _id: productId,
      });
      let products = [];

      if (wishlist) {
        products = wishlist.products;
        products.push(product);

        await Wishlist.findByIdAndUpdate(
          wishlist._id,
          { userId: userId, products: products },
          { new: true }
        );
        // console.log("old");
        res.json({
          status: "success",
          message: "wishlist updated successfully",
          data: products,
        });
      } else {
        const user = await User.findById({
          _id: userId,
        });
        products.push(product);
        let data = {
          userId: user,
          products: products,
        };
        let wishlist = new Wishlist(data);
        await wishlist.save(data => {
          res.json({
            status: "success",
            msg: "wishlist created!!!",
            data: products,
          });
        });
        // console.log("new");
      }
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get product details",
      });
    }
  },
  removeProductFromWishlist: async (req, res) => {
    try {
      let userId = req.user._id;
      let wishlist = await Wishlist.findOne({ userId });
      let productId = req.body._id;

      let products = [];

      if (wishlist) {
        let products = wishlist.products;
        let index = products.findIndex(item => item._id === productId);

        products.splice(index, 1);

        await Wishlist.findByIdAndUpdate(
          wishlist._id,
          {
            userId: userId,
            products: products,
            address: req.body.address,
          },
          { new: true }
        );

        res.json({
          status: "success",
          message: "wishlist updated successfully",
          data: products,
        });
      } else {
        res.status(400).json({
          message: "Failed to find wishlist",
        });
      }
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get product details",
      });
    }
  },
  getProductsFromWishlist: async (req, res) => {
    try {
      let userId = req.user._id;
      let wishlist = await Wishlist.findOne({ userId });

      if (wishlist) {
        let products = wishlist.products;
        let productsInWishList = [];
        for (let i = 0; i < products.length; i++) {
          const product = await Product.findById({
            _id: products[i]._id,
          });
          productsInWishList.push(product);
        }
        wishlist = {
          _id: wishlist._id,
          modifiedOn: wishlist.modifiedOn,
          products: productsInWishList,
          userId: wishlist.userId,
        };
      }
      res.json({
        status: "success",
        message: "User Wishlist",
        data: wishlist,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get products",
      });
    }
  },
};
