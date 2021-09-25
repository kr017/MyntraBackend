var express = require("express");
var router = express.Router();
const userAuthenticated = require("../middlewares/userAuthenticated");
const userExists = require("../middlewares/userExists");
const AddressController = require("../controller/address");

router.all("/api/*", userAuthenticated, userExists);
router.post("/api/addAddress", AddressController.addAddress);
router.put("/api/updateAddress", AddressController.updateAddress);
router.delete("/api/deleteAddress/:id", AddressController.deleteAddress);
router.get("/api/addresses", AddressController.getAddresses);

module.exports = router;
