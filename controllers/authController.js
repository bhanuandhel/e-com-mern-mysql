const ErrorHandler = require("../utils/errorhandler");
const { check, validationResult } = require("express-validator");
const { Users } = require("../models/User");
const {
  hashedPassword,
  createToken,
  comparePassword,
} = require("../utils/authServices");

const login = (req, resp, next) => {
  const errors = validationResult(req);

  // return next(new ErrorHandler("Product not found", 404))

  if (!errors.isEmpty()) {
    return resp.json(errors);
  }

  const response = {
    data: "login",
  };
  return resp.status(200).json(response);
};

const register = async (req, resp, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // validations failed
    return resp.status(400).json({ errors: errors.array() });
  } else {
    const {name, email, password} = req.body;
    try {
      const emailExist = await Users.findOne({ email });
      if (!emailExist) {
        const hashed = await hashedPassword(password);
        const user = await Users.create({
          name,
          email,
          password: hashed,
        });
        const token = createToken({ id: user._id, name: user.name });
        return res
          .status(201)
          .json({ msg: "Your account has been created!", token });
      } else {
        // email already taken
        return res
          .status(401)
          .json({ errors: [{ msg: `${email} is already taken` }] });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json("Server internal error!");
    }
  }

  const response = {
    data: "register",
  };
  return resp.status(200).json(response);
};

module.exports = {
  login,
  register,
};
