const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

const verifyPassword = async (password, hashedPassword) => {
  const verified = await bcrypt.compare(password, hashedPassword);
  return verified;
};

const createJWT = (payload) => {
  return jwt.sign(payload, process.env.SECRET_CODE, { expiresIn: "15 mins" });
};

const verifyJWT = (token) => {
  return jwt.verify(token, process.env.SECRET_CODE);
};

const createPayload = (username, id) => {
  const obj = {
    username: username,
    id: id,
  };
  return obj;
};

module.exports = {
  hashPassword,
  verifyPassword,
  createJWT,
  verifyJWT,
  createPayload,
};
