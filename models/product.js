const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;
const connection = require("../db/connection");
const { encrypt } = require("../utils/encrypt");
const productSchema = new Schema(
  {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    brand: {
      type: String,
    },
    category: {
      type: String,
    },
    price: {
      type: Object,
    },
    image: {
      type: Array,
    },
    color: {
      type: String,
    },
  },
  { collection: "product" }
);

const Product = mongoose.model(productSchema.options.collection, productSchema); //table

module.exports = Product;
