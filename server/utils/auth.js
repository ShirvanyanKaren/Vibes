const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

module.exports = {
  checkAuth: function (req, res, next) {
    let token = req.headers.authorization || "";

    if (token) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.exp <= Math.floor(Date.now() / 1000)) {
        return res.status(401).json({ message: "Token expired" });
      }

      const newToken = jwt.sign({ data: decoded.data }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRATION,
      });

      res.setHeader('Authorization', `Bearer ${newToken}`);

      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ message: "Invalid token" });
    }
  },
  signToken: function ({ username}) {
    const payload = { username };
    return jwt.sign({ data: payload }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRATION,
    });
  },
};