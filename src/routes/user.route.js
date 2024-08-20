const express = require("express");
const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");
const userRouter = express.Router();

userRouter.post("/check/:username", userController.usernameCheck);

// protected api👇
userRouter.put("/:id", authController.validate, userController.updateUser);
userRouter.get("/profile", authController.validate, userController.getUserById);

module.exports = userRouter;
