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
  createCookie,
  checkRefreshToken,
  createNewAccessToken,
  generateCurrentDate,
} = require("./utils/authUtils");

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
  createCookie,
  checkRefreshToken,
  createNewAccessToken,
  generateCurrentDate,
};
