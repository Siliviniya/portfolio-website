const { StatusCodes } = require("http-status-codes");
const {
  registerLogic,
  loginLogic,
  verifyCodeLogic,
  forgotPasswordLogic,
  resetPasswordLogic,
  sendNewCodeLogic,
} = require("../domain/domain");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const registered = await registerLogic(username, email, password);
  return res
    .status(StatusCodes.CREATED)
    .json({ msg: "Please verify your code", account: registered });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const token = await loginLogic(email, password);
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Log in successful!", accessToken: token });
};

const verifyCode = async (req, res) => {
  const { email, code } = req.body;
  await verifyCodeLogic(email, code);
  return res.status(StatusCodes.OK).json({ msg: "Verification successful!" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  await forgotPasswordLogic(email);
  return res.status(StatusCodes.OK).json({ msg: "Verification code sent!" });
};

const resetPassword = async (req, res) => {
  const { email, newPassword, repeatPassword } = req.body;
  await resetPasswordLogic(email, newPassword, repeatPassword);
  return res
    .status(StatusCodes.OK)
    .json({ msg: "Password changed sucessfully!" });
};

const sendNewCode = async (req, res) => {
  const { email } = req.body;
  await sendNewCodeLogic(email);
  return res.status(StatusCodes.OK).json({ msg: "Verification code sent!" });
};

module.exports = {
  register,
  login,
  verifyCode,
  forgotPassword,
  resetPassword,
  sendNewCode,
};
