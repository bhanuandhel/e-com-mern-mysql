const ErrorHandler = require("../utils/errorhandler");
const { check, validationResult } = require("express-validator");
const Users = require("../models/User");
const sendEmail = require("../utils/sendEmail");


const {
  hashedPassword,
  createToken,
  comparePassword,
  getResetPasswordToken
} = require("../utils/authServices");

// login

const login = async (req, resp, next) => {
  const errors = validationResult(req);

  // return next(new ErrorHandler("Product not found", 404))

  if (!errors.isEmpty()) {
    return resp.status(400).json({ errors: errors.array() });
  } else {
    const { email, password } = req.body;
    try {
      const user = await Users.findOne({ where: { email } });
      if (user) {
        const checkPassword = await comparePassword(password, user.password);
        if (checkPassword) {
          const token = createToken({ id: user.id, name: user.name });
          // option for cookie
          const options = {
            expires: new Date(
              Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };

       return  resp.status(200).cookie("token", token, options).json({
            success: true,
            user,
            token,
          });
        } else {
          return resp
            .status(401)
            .json({ errors: [{ msg: `Password does not match` }] });
        }
      } else {
        return resp
          .status(401)
          .json({ errors: [{ msg: `User Name and Password does not match` }] });
      }
    } catch (error) {
      console.log(error.message);
      return resp.status(500).json("Server internal error!");
    }
  }

  const response = {
    data: "login",
  };
  return resp.status(200).json(response);
};

// register

const register = async (req, resp, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // validations failed
    return resp.status(400).json({ errors: errors.array() });
  } else {
    const { name, email, password, phone, role } = req.body;
    try {
      const emailExist = await Users.findOne({ where: { email } });
      if (!emailExist) {
        const hashed = await hashedPassword(password);
        const user = await Users.create({
          name,
          email,
          phone,
          role,
          password: hashed,
        });
        const token = createToken({ id: user.id, name: user.name });
        return resp
          .status(201)
          .json({ msg: "Your account has been created!", token });
      } else {
        // email already taken
        return resp
          .status(401)
          .json({ errors: [{ msg: `${email} is already taken` }] });
      }
    } catch (error) {
      console.log(error.message);
      return resp.status(500).json("Server internal error!");
    }
  }

  const response = {
    data: "register",
  };
  return resp.status(200).json(response);
};

// forgotPassword

const forgotPassword = async(req, resp, next)=>{
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
    // validations failed
      return resp.status(400).json({ errors: errors.array() });
    } else {
      const { email } = req.body;
      try {
         const emailExist = await Users.findOne({ where: { email } });
          if(!emailExist){
            return resp.status(401).json("email not found!");
          }else{
                  const resetPasswordToken = await getResetPasswordToken();
                  const user = await Users.update({resetPasswordToken}, {where: { email }});
                  const resetPasswordUrl = `${req.protocol}://${req.get(
                                              "host"
                                            )}/password/reset/${resetPasswordToken}`;
                  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

                     try {

                        await sendEmail({
                            email: emailExist.email,
                            subject: `Ecommerce Password Recovery`,
                            message,
                        });

                      return  resp.status(200).json({
                          success: true,
                          message: `Email sent to ${user.email} successfully`,
                        });
                        
                      } catch (error) {
                          console.log(error.message);
                          return resp.status(500).json("Server internal error!");
                    }
          }

      } catch(error){
          console.log(error.message);
          return resp.status(500).json("Server internal error!");
      }
    }

      const response = {
        data: "forgotPassword",
      };
  return resp.status(200).json(response);
}

// Logout User

const logout = async (req, resp, next) => {
  try {
    resp.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

  return  resp.status(200).json({
      success: true,
      message: "Logged Out",
    });
  } catch (error) {
    console.log(error.message);
    return resp.status(500).json("Server internal error!");
  }
};

module.exports = {
  login,
  register,
  forgotPassword,
  logout,
};
