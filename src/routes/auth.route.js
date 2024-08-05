const express = require("express");
const authController = require("../controller/auth.controller");
const router = express.Router();

//input > (json) > server > hash pw > masukin ke db > bikin token jwt > kirim kej client > client > setcookie = token
router.post(
  "/registration",
  authController.hashingPw,
  authController.registration
);
router.post("/login", authController.login);

module.exports = router;
