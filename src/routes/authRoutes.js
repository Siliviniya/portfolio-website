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

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/verify", verifyCode);
authRouter.post("/forgotpassword", forgotPassword);
authRouter.post("/resetpassword", resetPassword);
authRouter.post("/sendnewcode", sendNewCode);

module.exports = authRouter;
