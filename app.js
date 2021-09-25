var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const productsRouter = require("./routes/product");
const usersRouter = require("./routes/user");
const wishlistsRouter = require("./routes/wishlist");
const cartsRouter = require("./routes/cart");
const addressRouter = require("./routes/address");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: "*",
  })
);
app.use("/product", productsRouter);
app.use("/wishlist", wishlistsRouter);
app.use("/cart", cartsRouter);
app.use("/address", addressRouter);

app.use("/user", usersRouter);
app.use('/',express.static(path.join(__dirname, 'website')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'website', 'index.html'));
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ msg: err });
});

module.exports = app;
