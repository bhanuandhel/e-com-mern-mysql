var express = require("express");
var router = express.Router();
const { validateLogin, validateRegister, validateresetPassword, validateforgotPassword, validatechangePassword } = require("../middlewares/validators/userValidator");
const { login, register, forgotPassword, resetPassword, changePassword, logout } = require("../controllers/authController");
const {isAuthenticatedUser} = require("../middlewares/auth")


// api = login
// url = http://localhost:5000/api/users/login
// type = post
// payload = {email:'bhanupratap636@gmail.com', password:'bhnau@123'}

router.post("/login", validateLogin, login);

// api = register
// url = http://localhost:5000/api/users/register 
// type = post
// payload = {"name":"bhanu", "email":"bhanupratap636@gmail.com", "phone":"9758760136","password":"bhnau@123", "role":"user" }

router.post("/register", validateRegister, register);

// api = forgotPassword
// url = http://localhost:5000/api/users/forgot-password
// type = put
// payload = {"email":"bhanupratap636@gmail.com" }

router.put("/forgot-password", validateforgotPassword,  forgotPassword)

// api = resetPassword
// url = http://localhost:5000/api/users/forgot-password
// type = put
// payload = {"email":"bhanupratap636@gmail.com", "token":"d7dc16b5c55221b6f1dda3f3ce38b50c292ff1b3e91ac6b82534536815ed89ee", "newPassword":"bhanu@123" }

router.put("/reset-password", validateresetPassword,  resetPassword)

// api = changePassword
// url = http://localhost:5000/api/users/change-password
// type = put
// payload = {"password":"12345", confirmPassword:"12345" }

router.put("/change-password", isAuthenticatedUser, validatechangePassword,  changePassword)

// api = logout
// url = http://localhost:5000/api/users/logout
// type = post

router.post("/logout", logout);

module.exports = router;
