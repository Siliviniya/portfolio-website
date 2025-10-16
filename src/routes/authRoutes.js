const express = require("express");
const authRouter = express.Router();
const { register, login } = require("../users/index");

authRouter.post("/register", register);
authRouter.post("/login", login);

module.exports = authRouter;
