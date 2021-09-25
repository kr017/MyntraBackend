const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;
const wishlistSchema = new Schema(
  {
    id: {
      type: String,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    products: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
      },
    ],
    modifiedOn: {
      type: Date,
    },
  },
  { collection: "wishlist" }
);

wishlistSchema.pre("save", function (next) {
  const note = this;
  note.modifiedOn = moment().unix() * 1000;

  next();
});

const Wishlist = mongoose.model(
  wishlistSchema.options.collection,
  wishlistSchema
); //table

module.exports = Wishlist;
