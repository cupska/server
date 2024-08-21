const bcrypt = require("bcryptjs");
const { request, response } = require("express");
const { getUserByUsername } = require("../model/user.model");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
const { config } = require("dotenv");
const {
  extractTokenFromCookieHeader,
} = require("../utils/extractTokenFromCookieHeader");
config();

const registration = async (req = request, res = response, next) => {
  const { body } = req;
  try {
    const newUser = await userModel.createUser(body);
    const token = jwt.sign(newUser, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(201)
      .json({ data: { message: "berhasil buat akun" }, error: null });
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

const login = async (req = request, res = response, next) => {
  const { password, username } = req.body;
  try {
    const { password: savedPw, ...restUserData } = await getUserByUsername({
      username,
    }).catch((err) => {
      err.statusCode = 403;
      next(err);
    });

    const isPwValid = await bcrypt.compare(password, savedPw);
    if (!isPwValid) throw new Error("username atau password salah");

    const token = jwt.sign({ user: restUserData }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .cookie("token", token, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
      })
      .status(200)
      .json({
        data: { message: "berhasil masuk" },
        error: null,
      });
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};

const logout = async (req = request, res = response, next) => {
  try {
    res
      .clearCookie("token", { sameSite: "none" })
      .status(200)
      .send("Berhasil logout");
  } catch (err) {
    err.statusCode = 400;
    next(err);
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
  }
};

const validate = async (req = request, res = response, next) => {
  const token = req.cookies["token"];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
  try {
    const { user } = jwt.verify(token, process.env.JWT_SECRET);
    req.params = { user, ...req.params };
    next();
  } catch (err) {
    res.status(401).json({
      data: { isAuthenticated: false },
      error: { message: "Token is not valid" },
    });
  }
};

module.exports = {
  hashingPw,
  login,
  validate,
  registration,
  logout,
};
