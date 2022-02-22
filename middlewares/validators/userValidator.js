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
    check("name", "please enter name").trim().escape(),
    check("email", "please enter valid email").isEmail().normalizeEmail(),
    check("phone", "please enter valid number").isNumeric().isLength({min: 8, max: 10}),
    check("password", "please enter min 8 and max 10 digit").isLength({min: 8, max: 10 }),
    check("role", "role must be in employ, user").isIn(['employ', 'user'])
  
  ]
