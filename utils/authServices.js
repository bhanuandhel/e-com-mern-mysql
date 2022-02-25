const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

require("dotenv").config();

module.exports.hashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
}

module.exports.comparePassword = async (password, dbPassword) => {
    return await bcrypt.compare(password, dbPassword);
}

module.exports.createToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: '7d'
    } )
}

module.exports.getResetPasswordToken = () =>{
    
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Hashing and adding resetPasswordToken to userSchema
    return crypto.createHash("sha256").update(resetToken).digest("hex");

     
}