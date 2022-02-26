const ErrorHandler = require("../utils/errorhandler");
const Users = require("../models/User");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = async (req, resp, next) => {
  const { token } = req.cookies;
  try {
    if (!token) {
      return resp
        .status(401)
        .json({ errors: "Please Login to access this resource" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Users.findByPk(decodedData.id);

    next();
  } catch (error) {
    console.log(error);
    return resp.status(500).json("Server internal error!");
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resouce `,
          403
        )
      );
    }
    next();
  };
};
