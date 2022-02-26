const ErrorHandler = require("../utils/errorhandler");
const { check, validationResult } = require("express-validator");
const crypto = require("crypto");
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
                                            )}/password/reset?token=${resetPasswordToken}&email=${email}`;
                  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

                     try {
                        await sendEmail({
                            email: emailExist.email,
                            subject: `Ecommerce Password Recovery`,
                            message,
                        });

                      return  resp.status(200).json({
                          success: true,
                          message: `Email sent to ${emailExist.email} successfully`,
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


// reset password

const resetPassword = async (req, resp, next)=>{

    const errors = validationResult(req);

    // validations failed
    if (!errors.isEmpty()) {
        return resp.status(400).json({ errors: errors.array() });
    }

      const {token, email, newPassword } = req.body;
      const password = await hashedPassword(newPassword);

        try {
          const user = await Users.findOne({where: { resetPasswordToken : token}});
         if (!user) {
              return resp.status(400).json({ errors: "Reset Password Token is invalid or has been expired" }); 
          }

           try {
                await Users.update({resetPasswordToken:null, password}, {where: { email }});
                return  resp.status(200).json({
                      success: true,
                      message: `password is reset successfully`,
                    });  
              } catch (error) {
                      console.log(error.message);
                      return resp.status(500).json("Server internal error!");
            }


        } catch (error) {
            console.log(error.message);
            return resp.status(500).json("Server internal error!");
        }

       const response = {
        data: "resetPassword",
      };
  return resp.status(200).json(response);
}


// change password

const changePassword = async (req, resp, next)=>{
    console.log(req.user.name, req.body.password, req.body.passwordConfirmation)
    const {password, passwordConfirmation} = req.body
    const errors = validationResult(req);
      // validations failed
      if (!errors.isEmpty()) {
        return resp.status(400).json({ errors: errors.array() });
      }

        try {
              const hashed = await hashedPassword(password);
              await Users.update({password: hashed}, {where: { id : req.user.id }, returning: true,plain: true});
              
              return  resp.status(200).json({
                      success: true,
                      message: `password is change successfully`,
                    }); 
          
        } catch (error) {
          console.log(error.message);
          return resp.status(500).json("Server internal error!");
        }

     const response = {
        data: "changePassword",
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
  resetPassword,
  changePassword,
  logout,
};
