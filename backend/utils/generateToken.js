const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },                // payload
    process.env.JWT_SECRET,        // secret
    { expiresIn: "2d" }            // expiry
  );
};

module.exports = generateToken;