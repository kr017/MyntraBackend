const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = (req, res, next) => {
  let token = req.headers["authorization"] || "";

  jwt.verify(token, config.secret, (err, decodedToken) => {
    if (err) {
      res.status(401).json({ message: err && err.message });
    } else if (decodedToken && decodedToken._id) {
      req.user = decodedToken;
      next();
    } else {
      res.status(500).json({
        message: "Internal server error",
      });
    }
  });
};
