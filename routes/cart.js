var express = require("express");
var router = express.Router();
const userAuthenticated = require("../middlewares/userAuthenticated");
const userExists = require("../middlewares/userExists");
const CartController = require("../controller/cart");
const OrderController = require("../controller/order");

router.all("/api/*", userAuthenticated, userExists);
router.post("/api/addCart", CartController.addOrUpdateCart);
router.get("/api/cart", CartController.getProductsFromCart);
router.post("/api/removeCart", CartController.removeProductFromCart);

router.post("/api/checkout", OrderController.placeOrder);
router.get("/api/orders", OrderController.getOrders);

module.exports = router;
