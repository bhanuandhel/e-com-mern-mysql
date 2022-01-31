const { check, validationResult } = require("express-validator");

const login = (req, resp) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return resp.json(errors);
  }

  const response = {
    data: "login",
  };
  return resp.status(200).json(response);
};


const register = (req, resp)=>{
      const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return resp.json(errors);
  }

  const response = {
    data: "register",
  };
  return resp.status(200).json(response);
}

module.exports = {
  login,
  register
};
