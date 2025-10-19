const express = require("express");
const authRouter = express.Router();
const {
  register,
  login,
  verifyCode,
  forgotPassword,
  resetPassword,
  sendNewCode,
} = require("../users/index");
const {
  validateHandler,
  registerValidator,
  loginValidator,
  resetPasswordValidator,
} = require("../libraries/middleware/validator");

authRouter.post("/register", registerValidator, validateHandler, register);
authRouter.post("/login", loginValidator, validateHandler, login);
authRouter.post("/verify", verifyCode);
authRouter.post("/forgotpassword", forgotPassword);
authRouter.post(
  "/resetpassword",
  resetPassword,
  validateHandler,
  resetPassword
);
authRouter.post("/sendnewcode", sendNewCode);

module.exports = authRouter;
