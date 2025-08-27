const express = require("express");
const router = express.Router();
const isloggedin = require("../middleware/isLoggedin");
const fs = require("fs");

router.get("/", function (req, res) {
  let error = req.flash("error");
  res.render("index", { error: "" });
});


const Product = require("../models/product-model"); 

router.get('/shop', (req, res) => {
    const products = [
        {
            name: 'Laptop',
            price: 55000,
            bgcolor: '#f0f0f0',
            panelcolor: '#ffffff',
            textcolor: '#000000',
            // image: fs.readFileSync('public/images/laptop.jpg')
        },
        {
            name: 'Phone',
            price: 25000,
            bgcolor: '#e0e0e0',
            panelcolor: '#f8f8f8',
            textcolor: '#333333',
            // image: fs.readdirSync("")
        }
    ];

    res.render('shop', { products });  // Passing products to EJS
});

router.get("/logout", isloggedin, function (req, res) {
  res.render("/logout");
});

module.exports = router;
