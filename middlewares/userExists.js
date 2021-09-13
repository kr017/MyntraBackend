const User = require("../models/user");

module.exports = (req, res, next) => {
  User.findById(req.user._id, (err, user) => {
    if (err) {
      return res.status(400).json({
        message: err && err.message,
      });
    } else if (user) {
      next();
    } else {
      return res.status(400).json({
        message: "User doesn't exists",
      });
    }
  });
};
