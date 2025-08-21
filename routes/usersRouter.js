const express = require("express");
const joi = require("joi");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");

router.get("/", function (req, res) {
  res.send("hey its working");
});

router.post("/register", function (req, res) {
  try {
    let UserRequirement = joi.object({
      fullname: joi.string().min(3).max(10).required().messages({
        "string.empty": "full name is required",
        "any.required": "full name is required",
      }),
      email: joi.string().email().required().messages({
        "string.email": "please provide a valid email",
        "any.required": "email is required",
      }),

      password: joi
        .string()
        .pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/)
        .required()
        .messages({
          "string.pattern.base":
            "Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character",
          "any.required": "Password is required",
        }),
    });
    let { error } = UserRequirement.validate(req.body);
    if (error) {
      return res.status(400).send({
        success: false,
        message: error.details[0]?.message,
      });
    }

    let { email, password, fullname } = req.body;

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            fullname,
            email,
            password: hash,
          });
          res.send(user);
        }

        let token = jwt.sign({ email }, "shhhhh");
        res.cookie("token", token);
        res.send(user);
      });
    });
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
