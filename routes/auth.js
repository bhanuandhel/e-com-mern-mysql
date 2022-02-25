var express = require("express");
var router = express.Router();
const { validateLogin, validateRegister, validateforgotPassword } = require("../middlewares/validators/userValidator");
const { login, register, forgotPassword, logout } = require("../controllers/authController");

// api = login
// url = http://localhost:5000/api/users/login
// type = post
// parameter = {email:'bhanupratap636@gmail.com', password:'bhnau@123'}

router.post("/login", validateLogin, login);

// api = register
// url = http://localhost:5000/api/users/register 
// type = post
// parameter = {"name":"bhanu", "email":"bhanupratap636@gmail.com", "phone":"9758760136","password":"bhnau@123", "role":"user" }

router.post("/register", validateRegister, register);

// api = forgotPassword
// url = http://localhost:5000/api/users/forgot-password
// type = post
// parameter = {"email":"bhanupratap636@gmail.com" }

router.post("/forgot-password", validateforgotPassword,  forgotPassword)

// api = logout
// url = http://localhost:5000/api/users/logout
// type = post

router.post("/logout", logout);

module.exports = router;
