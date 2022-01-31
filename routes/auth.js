var express = require("express");
var router = express.Router();
const { validateLogin, validateRegister } = require("../middlewares/validators/userValidator");
const { login, register } = require("../controllers/authController");

router.post("/login", validateLogin, login);

router.post("/register", validateRegister, register);

module.exports = router;
