const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    message: err.message || "500 Internal server error",
    statusCode: err.statusCode || StatusCodes.BAD_REQUEST,
  };
  return res.status(customError.statusCode).json({ msg: customError.message });
};

module.exports = errorHandlerMiddleware;
