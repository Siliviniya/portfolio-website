const express = require("express");
const authRouter = express.Router();
const {
  register,
  login,
  verifyCode,
  forgotPassword,
  resetPassword,
  sendNewCode,
  sendNewAccessToken,
} = require("../users/index");
const {
  validateHandler,
  registerValidator,
  loginValidator,
  resetPasswordValidator,
} = require("../libraries/middleware/authValidator");

authRouter.post("/register", registerValidator(), validateHandler, register);
authRouter.post("/login", loginValidator(), validateHandler, login);
authRouter.post("/verify", verifyCode);
authRouter.post("/forgotpassword", forgotPassword);
authRouter.post(
  "/resetpassword",
  resetPasswordValidator(),
  validateHandler,
  resetPassword
);
authRouter.post("/sendnewcode", sendNewCode);
authRouter.post("/request_token", sendNewAccessToken);

module.exports = authRouter;
