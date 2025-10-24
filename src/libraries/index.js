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
const asyncWrapper = require("./utils/async");
const { uploadFiles } = require("./utils/postUtil");

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
  asyncWrapper,
  uploadFiles,
};
