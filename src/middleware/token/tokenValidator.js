const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const { config } = require("dotenv");
config();

exports.tokenValidator = async (req = request, res = response, next) => {
  const token = await req.cookies.token;
  // console.log(req.cookies);
  if (!token) {
    return res.status(401).json({ message: "Token tidak ada" });
  }

  try {
    // console.log(process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    error.statusCode = 401;
    res.redirect("/login");
    next(error);
  }
};
