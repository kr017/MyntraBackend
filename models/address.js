const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;
const addressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
    street: String,
    locality: String,
    city: String,
    state: String,
    country: String,
    zip: String,
    phone: String,
  },
  { collection: "address" }
);

addressSchema.pre("save", function (next) {
  const note = this;
  note.modifiedOn = moment().unix() * 1000;

  next();
});

const Cart = mongoose.model(addressSchema.options.collection, addressSchema); //table

module.exports = Cart;
