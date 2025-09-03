const express = require("express");
const router = express.Router();
const isloggedin = require("../middleware/isLoggedin");
const productModel = require("../models/product-model");
const isLoggedin = require("../middleware/isLoggedin");
const userModel = require("../models/user-model");

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error, Loggedin: false });
});

router.get("/shop", isLoggedin, async (req, res) => {
  let products = await productModel.find();
  let success = req.flash("success");
  res.render("shop", { products, success });
});

router.get("/cart", isLoggedin, async (req, res) => {
  let user = await userModel
    .findOne({ eamil: req.user.email })
    .populate("cart");
  
  res.render("cart" , {user});
});

router.get("/addtocart/:id", isloggedin, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Added to cart");
  res.redirect("/shop");
});

router.get("/logout", isloggedin, function (req, res) {
  res.render("shop");
});

module.exports = router;
