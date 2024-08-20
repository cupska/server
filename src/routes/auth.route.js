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
router.post("/logout", authController.logout);
router.get("/session", authController.validate, (req, res) =>
  res.status(200).json({
    data: { isAuthenticated: true, user: req.params.user },
    error: null,
  })
);

module.exports = router;
