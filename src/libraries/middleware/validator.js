const { body, params, validationResult } = require("express-validator");

const validateHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
  } else {
    const errorMessage = errors.array().map((error) => error.msg);
    throw new Error(errorMessage);
  }
};

const registerValidator = () => [
  body("username")
    .notEmpty()
    .withMessage("Please enter username")
    .isLength({ max: 10 })
    .withMessage("Characters must be below 10 characters"),
  body("email")
    .notEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Please type valid email"),
  body("password")
    .notEmpty()
    .withMessage("Please enter password")
    .isLength({ min: 8 })
    .withMessage("Password must be above 8 characters"),
];

const loginValidator = () => [
  body("email")
    .notEmpty()
    .withMessage("Please enter email")
    .isEmail()
    .withMessage("Please type valid email"),
  body("password").notEmpty().withMessage("Please type password"),
];

const resetPasswordValidator = () => [
  body("repeatPassword")
    .notEmpty()
    .withMessage("Please enter password")
    .isLength({ min: 8 })
    .withMessage("New password must be above 8 characters"),
  body("newPassword")
    .notEmpty()
    .withMessage("Please enter your new password again"),
];

module.exports = {
  validateHandler,
  registerValidator,
  loginValidator,
  resetPasswordValidator,
};
