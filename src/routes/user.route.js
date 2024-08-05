const express = require("express");
const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");
const userRouter = express.Router();

userRouter.post("/check/:username", userController.usernameCheck);

// protected api👇
userRouter.put("/:id", authController.verify, userController.updateUser);


module.exports = userRouter;
