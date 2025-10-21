const errorHandlerMiddleware = require("./middleware/error-handler");
const {
  hashPassword,
  verifyPassword,
  createJWT,
  verifyJWT,
  createPayload,
  generateVerificationCode,
  sendVerificationEmail,
  generateRefreshToken,
  createVerificationCode,
  getUserFromDb,
  createCookie,
} = require("./utils/utils");

module.exports = {
  errorHandlerMiddleware,
  hashPassword,
  verifyPassword,
  createJWT,
  verifyJWT,
  createPayload,
  generateVerificationCode,
  sendVerificationEmail,
  generateRefreshToken,
  createVerificationCode,
  getUserFromDb,
  createCookie,
};
