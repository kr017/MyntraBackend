const mongoose = require("mongoose");
const config = require("../config");

let connect;
connect = mongoose
  .connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch(error => console.log(error));

module.exports = connect;
