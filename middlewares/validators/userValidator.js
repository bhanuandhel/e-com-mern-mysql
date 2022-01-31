const { check, validationResult } = require("express-validator");

exports.validateLogin = [
  check("password", "Password length should be 8 to 10 characters").isLength({
    min: 8,
    max: 10,
  }),
  check("email", "Please enter valid email address").isEmail()
];

exports.validateRegister = [
    // check("name")
    check("password", "Password length should be 8 to 10 characters").isLength({
    min: 8,
    max: 10,
  }),
  check("email", "Please enter valid email address").isEmail()
]
