var express = require("express");
var router = express.Router();
const userAuthenticated = require("../middlewares/userAuthenticated");
const userExists = require("../middlewares/userExists");
const ProductController = require("../controller/product");

router.post("/shop", ProductController.getAllProducts);
router.get("/shop/:id", ProductController.getProductDetails);
router.post("/filters", ProductController.getFiltersList);

module.exports = router;
