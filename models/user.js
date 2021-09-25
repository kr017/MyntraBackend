const mongoose = require("mongoose");
const moment = require("moment");
const Schema = mongoose.Schema;
const connection = require("../db/connection");
const { encrypt } = require("../utils/encrypt");
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    created_at: {
      type: Date,
    },
    stripe_id: {
      type: String,
    },
    last_modified: {
      type: Date,
    },
  },
  { collection: "user" }
);

userSchema.pre("save", function (next) {
  const user = this;
  user.password = encrypt(user.password);
  user.created_at = user.last_modified = moment().unix() * 1000;

  next();
});
const User = mongoose.model(userSchema.options.collection, userSchema); //table

module.exports = User;
