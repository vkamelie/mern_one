const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const SecToken = process.env.jwtSecret;

module.exports = function(req, res, next) {
  //get token from header
  const token = req.header("x-auth-token");

  //check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  //verify token
  try {
    const decoded = jwt.verify(token, SecToken);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not vaild" });
  }
};
