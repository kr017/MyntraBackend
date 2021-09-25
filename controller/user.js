const User = require("../models/user");
const config = require("../config");
const jwt = require("jsonwebtoken");
const { decrypt } = require("../utils/encrypt");
module.exports = {
  signup: async (req, res) => {
    try {
      if (!req.body.email || !req.body.password || !req.body.name) {
        throw { message: "All fields are required" };
      }
      let oldUser = await User.findOne({ email: req.body.email });

      if (oldUser) {
        throw { message: "User already exists" };
      }

      //success
      let user = new User(req.body);
      let newUser = await user.save();
      res.json({
        status: "success",
        message: "Registration Successful!!!",
      });
    } catch (error) {
      res.status(400).json({
        message: (error && error.message) || "Ooops!!! Registration Failed",
      });
    }
  },

  login: async (req, res) => {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: "All fields are required" });
      }
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );

      let user = await User.findOne({ email: req.body.email });

      if (user) {
        let result = decrypt(req.body.password, user.password);
        if (result) {
          //JWT token
          let jwtPayload = {
            _id: user._id,
            email: user.email,
          };
          let token = jwt.sign(jwtPayload, config.secret, {
            expiresIn: 60 * 60 * 24,
          });
          user = user.toJSON();
          user.token = token;
          delete user.password;
          res.json({
            status: "success",
            message: "Login Successful!!!",
            data: user,
          });
        } else {
          throw { message: "Please check your credentials" };
        }
      } else {
        throw { message: "Please check your credentials" };
      }
    } catch (error) {
      res.status(400).json({
        message: (error && error.message) || "Ooops!!! Failed to login",
      });
    }
  },

  checkMail: async (req, res) => {
    try {
      if (!req.body.email) {
        throw { message: "Email is required" };
      }

      let user = await User.findOne({ email: req.body.email });
      if (user) {
        res.json({
          status: "success",
        });
      } else {
        throw { message: "Account doesn't exists" };
      }
    } catch (error) {
      res.status(400).json({
        message: (error && error.message) || "Ooops!!! Account doesn't exists",
      });
    }
  },
};
