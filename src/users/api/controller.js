const { StatusCodes } = require("http-status-codes");
const { registerLogic, loginLogic } = require("../domain/domain");

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const registered = await registerLogic(username, email, password);
  return res
    .status(StatusCodes.CREATED)
    .json({ msg: "Account registered successfully!", account: registered });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  await loginLogic(email, password);
  return res.status(StatusCodes.OK).json({ msg: "Log in successful!" });
};

module.exports = { register, login };
