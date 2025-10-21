const error = require("../../libraries/errors");
const {
  hashPassword,
  verifyPassword,
  generateRefreshToken,
  sendVerificationEmail,
  createVerificationCode,
  checkRefreshToken,
  createNewAccessToken,
  generateCurrentDate,
} = require("../../libraries/index");
const { dbQuery } = require("../../config/index");
const { registerData } = require("../data-access/data-access");
const {
  select,
  insert,
  update,
  deleteData,
} = require("../../libraries/query/index");

const registerLogic = async (username, email, password) => {
  const alreadyRegistered = await dbQuery(
    "select * from users where email = $1",
    [email]
  );
  if (alreadyRegistered.rows.length > 0) {
    throw new error.BadRequest("Invalid email or password");
  }
  const hashedPassword = await hashPassword(password);
  const registered = await registerData(username, email, hashedPassword);

  const code = await createVerificationCode(email);
  await sendVerificationEmail(email, code);
  return registered;
};

const loginLogic = async (userEmail, userPassword) => {
  const user = await select("users", "email", userEmail);
  const { password, id, username } = user;
  const isTrue = await verifyPassword(userPassword, password);
  if (!isTrue) {
    throw new error.BadRequest("Invalid email or password");
  }
  const accessToken = createNewAccessToken(username, id);
  const refreshToken = generateRefreshToken();
  const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  await insert(
    "refreshtoken",
    ["refresh_token", "user_email", "expires_in"],
    [refreshToken, userEmail, expiryDate]
  );
  return { accessToken, refreshToken };
};

const verifyCodeLogic = async (email, userCode) => {
  const codeData = await select("users", "verification_code", email);
  const currentDate = generateCurrentDate();
  const { code, expires_in } = codeData;
  if (currentDate > expires_in) {
    await deleteData("verification_code", "user_email", [email]);
    throw new error.BadRequest("Verification failed please try again");
  }
  if (userCode !== code) {
    throw new error.BadRequest("Invalid code please try again");
  }
};

const forgotPasswordLogic = async (email) => {
  const code = await createVerificationCode(email);
  await sendVerificationEmail(email, code);
};

const resetPasswordLogic = async (email, newPassword, repeatPassword) => {
  if (repeatPassword !== newPassword) {
    throw new error.BadRequest(
      "Password reset failed. Please check your input"
    );
  }
  const hashedPassword = await hashPassword(repeatPassword);
  await update("users", "password", "email", [hashedPassword, email]);
};

const sendNewCodeLogic = async (email) => {
  const code = await createVerificationCode(email);
  await sendVerificationEmail(email, code);
};

const sendNewAccessTokenLogic = async (email) => {
  const checkedToken = await checkRefreshToken(email);
  if (checkedToken) {
    const { username, id } = checkedToken;
    const newAccessToken = createNewAccessToken(username, id);
    return newAccessToken;
  }
};

module.exports = {
  registerLogic,
  loginLogic,
  verifyCodeLogic,
  forgotPasswordLogic,
  resetPasswordLogic,
  sendNewCodeLogic,
  sendNewAccessTokenLogic,
};
