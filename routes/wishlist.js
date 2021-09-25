var express = require("express");
var router = express.Router();
const userAuthenticated = require("../middlewares/userAuthenticated");
const userExists = require("../middlewares/userExists");
const WishlistController = require("../controller/wishlist");

router.all("/api/*", userAuthenticated, userExists);
router.post("/api/addWishlist", WishlistController.addProductToWishlist);
router.get("/api/wishlist", WishlistController.getProductsFromWishlist);
router.post(
  "/api/removeWishlist",
  WishlistController.removeProductFromWishlist
);

module.exports = router;
