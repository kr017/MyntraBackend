const User = require("../models/user");
const Address = require("../models/address");
const moment = require("moment");
module.exports = {
  addAddress: (req, res) => {
    if (!req.body.phoneNumber) {
      return res.status(400).json({
        msg: "contact is required",
      });
    }

    req.body.userId = req.user._id;
    const address = new Address(req.body);
    address.save((err, data) => {
      if (err) {
        return res.status(400).json({
          msg: " failed",
        });
      }
      res.json({
        status: "success",
        msg: "address added!!!",
        data: data,
      });
    });
  },
  updateAddress: async (req, res) => {
    try {
      if (!req.body._id) {
        throw { message: "id is required." };
      }

      let userAddress = await Address.findById(req.body._id);

      let updatedAddress = await Address.findByIdAndUpdate(
        req.body._id,
        {
          name: req.body.name ? req.body.name : userAddress.name,
          street: req.body.street ? req.body.street : userAddress.street,
          locality: req.body.locality
            ? req.body.locality
            : userAddress.locality,
          city: req.body.city ? req.body.city : userAddress.city,
          state: req.body.state ? req.body.state : userAddress.state,

          country: req.body.country ? req.body.country : userAddress.country,
          zip: req.body.zip ? req.body.zip : userAddress.zip,
          phone: req.body.phone ? req.body.phone : userAddress.phone,

          last_modified: moment().unix() * 1000,
        },
        { new: true }
      );

      res.json({
        status: "success",
        message: " updated successfully",
        data: updatedAddress,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "update failed",
      });
    }
  },
  getAddresses: async (req, res) => {
    try {
      let sort = {};
      if (req.body.order) {
        sort[req.body.field] = parseInt(req.body.order); //order=1  =>ASC
        // sort["title"]=1 //sorting by title in ASC order
      } else {
        sort.created_at = -1;
      }
      let search = { userId: req.user._id };

      let addresses = await Address.find(search)
        .collation({ locale: "en_US", strength: 1 }) //letter casing
        .sort(sort);

      res.json({
        status: "success",
        message: "User Wishlist",
        data: addresses,
      });
    } catch (err) {
      res.status(400).json({
        message: (err && err.message) || "Failed to get products",
      });
    }
  },
  deleteAddress: async (req, res) => {
    try {
      if (!req.params.id) {
        throw { message: "id is required." };
      }

      let deleteAddress = await Address.findByIdAndDelete(req.params.id);
      res.json({
        status: "success",
        message: "deleted successfully",
      });
    } catch (error) {
      res.status(400).json({
        message: (error && error.message) || "Note update failed",
      });
    }
  },
};
