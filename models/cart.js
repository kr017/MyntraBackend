const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;
const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: {
          type: Number,
        },
        size: { type: String },
      },
    ],
    modifiedOn: {
      type: Date,
    },
  },
  { collection: "cart" }
);

cartSchema.pre("save", function (next) {
  const note = this;
  note.modifiedOn = moment().unix() * 1000;

  next();
});

const Cart = mongoose.model(cartSchema.options.collection, cartSchema); //table

module.exports = Cart;
