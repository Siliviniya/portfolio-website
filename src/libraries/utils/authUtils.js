const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
require("dotenv").config();
const crypto = require("crypto");
const { dbQuery } = require("../../config/index");
const { deleteData, insert, select } = require("../query/index");
const error = require("../errors");

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
  return jwt.sign(payload, process.env.SECRET_CODE, { expiresIn: "5m" });
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

// flexible creation of cookie for both refreshtoken and accesstoken
const createCookie = (res, type, token) => {
  res.cookie(type, token, {
    httpOnly: true,
    secure: process.env.DEV_MODE === "production",
    signed: true,
    sameSite: "Strict",
  });
};

const generateVerificationCode = () => {
  const code = crypto.randomInt(100000, 1000000);
  return code;
};

const generateRefreshToken = () => {
  const refreshToken = crypto.randomBytes(70).toString("hex");
  return refreshToken;
};

const sendVerificationEmail = async (email, code) => {
  let testAccount = await nodeMailer.createTestAccount();

  const transporter = nodeMailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: "admin@example.com",
    to: `${email}`,
    subject: "Verify your account",
    html: `<h2>Hello this is your verification code ${code}</h2>`,
  });
  const infoDetails = nodeMailer.getTestMessageUrl(info);
  return infoDetails;
};

const createVerificationCode = async (email) => {
  const code = generateVerificationCode();
  const codeExpiry = new Date(Date.now() + 1000 * 60 * 3);
  await dbQuery(
    "insert into verification_code (code, expires_in, user_email) values ($1, $2, $3)",
    [code, codeExpiry, email]
  );
  return code;
};

const generateCurrentDate = () => {
  const currentDate = new Date(Date.now());
  return currentDate;
};

const checkRefreshToken = async (email) => {
  const tokenExists = await select("refreshtoken", "user_email", email);
  const currentTime = generateCurrentDate();
  const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  if (currentTime > tokenExists.expires_in) {
    const refreshToken = generateRefreshToken();
    const tokenData = await dbQuery(
      "insert into (refresh_token, expires_in) values ($1, $2) on conflict (user_email) do update set refresh_token = extended.refreshToken, extended.expires_in",
      [refreshToken, expiryDate]
    );
    return tokenData.rows[0];
  }
  return tokenExists;
};

const createNewAccessToken = (username, id) => {
  const payload = createPayload(username, id);
  const newAccessToken = createJWT(payload);
  return newAccessToken;
};

module.exports = {
  hashPassword,
  verifyPassword,
  createJWT,
  verifyJWT,
  createPayload,
  createCookie,
  sendVerificationEmail,
  generateRefreshToken,
  generateVerificationCode,
  createVerificationCode,
  checkRefreshToken,
  createNewAccessToken,
  generateCurrentDate,
};
