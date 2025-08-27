const joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/user-model");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
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

    let user = await userModel.findOne({ email: email });
    if (user)
      return res.status(401).send("You already have an account, please login");

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        if (err) return res.send(err.message);
        else {
          let user = await userModel.create({
            fullname,
            email,
            password: hash,
          });

          let token = generateToken(user);
          res.cookie("token", token);
          res.send("user created sucessfully");
        }
      });
    });
  } catch (err) {
    console.error(err.message);
  }
};

module.exports.loginUser = async function (req, res) {
  let { email, password } = req.body;

  let user = await userModel.findOne({ email: email });
  if (!user) return res.send("Email or Password is incorrect");

  bcrypt.compare(password, user.password, function (err, result) {
    if (result) {
      let token = generateToken(user);
      res.cookie("token", token);
      res.redirect("/shop");
    } else {
      res.send("Email or Password is incorrect");
    }
  });
};

module.exports.logout = function (req , res ){
  res.cookie("token" , "");
  res.redirect("/");
};
