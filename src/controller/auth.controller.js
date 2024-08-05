const bcrypt = require("bcrypt");
const { request, response } = require("express");
const {
  getPayloadLoginByUsername: getUserPwByUsername,
} = require("../model/user.model");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
const { config } = require("dotenv");
config();

const registration = async (req = request, res = response, next) => {
  const { body } = req;
  try {
    const newUser = await userModel.createUser(body);
    const token = jwt.sign(newUser, process.env.JWT_SECRET, {
      expiresIn: "1800s",
    });
    res.status(201).json({ data: { token, ...newUser }, error: null });
  } catch (error) {
    console.error({ error });
    error.statusCode = 400;
    next(error);
    // res.status(400).json({ data: null, error: error });
  }
};

const login = async (req = request, res = response, next) => {
  const { password, username } = req.body;
  try {
    const { password: savedPw, ...rest } = await getUserPwByUsername({
      username,
    });
    const isValid = await bcrypt.compare(password, savedPw);
    const token = jwt.sign(rest, process.env.JWT_SECRET, {
      expiresIn: "1800s",
    });
    res.status(200).json({
      data: { token, rest, message: "Berhasil login  " },
    });  
  } catch (error) {
    error.stack = error.message;
    error.statusCode = 403;
    error.message = "telah terjadi kesalahan";
    next(error);
    // res.status(403).send(error.message);
  }
};

const hashingPw = async (req = request, res = response, next) => {
  try {
    const { password, ...rest } = req.body;
    // console.log(req.body);
    const saltRound = 12;
    const hased = await bcrypt.hash(password, saltRound);
    req.body.password = hased;
    next();
  } catch (error) {
    next(error);
    // res.status(400).json({error.message});
  }
};

const verify = async (req = request, res = response) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { hashingPw, login, verify, registration };
