const express = require("express");
const router = express.Router();
const isloggedin = require("../middleware/isLoggedin");
const productModel = require("../models/product-model");

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error });
});

router.get("/shop", async (req, res) => {
  let products= await productModel.find();
  res.render("shop", { products });
});

router.get("/logout", isloggedin, function (req, res) {
  res.render("shop");
});

module.exports = router;
