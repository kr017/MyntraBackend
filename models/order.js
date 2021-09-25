const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;
const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    payment: {},
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: {
          type: Number,
        },
        size: { type: String },
      },
    ],
    addressId: { type: Schema.Types.ObjectId, ref: "Address", default: null },

    modifiedOn: {
      type: Date,
    },
  },
  { collection: "order" }
);

orderSchema.pre("save", function (next) {
  const note = this;
  note.modifiedOn = moment().unix() * 1000;

  next();
});

const Order = mongoose.model(orderSchema.options.collection, orderSchema); //table

module.exports = Order;
