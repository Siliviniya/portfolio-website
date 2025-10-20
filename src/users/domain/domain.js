const error = require("../../libraries/errors");
const {
  hashPassword,
  verifyPassword,
  createJWT,
  createPayload,
  generateRefreshToken,
  sendVerificationEmail,
  createVerificationCode,
  getUserFromDb,
} = require("../../libraries/index");
const { dbQuery } = require("../../config/config");
const { registerData } = require("../data-access/data-access");
const { select } = require("../../libraries/query/index");

const registerLogic = async (username, email, password) => {
  const alreadyRegistered = await select("users", "email", email);
  if (alreadyRegistered) {
    throw new error.BadRequest("This email is already in use");
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
    throw new error.BadRequest("Double check your credentials");
  }
  const payload = createPayload(username, id);
  const accessToken = createJWT(payload);
  const refreshToken = generateRefreshToken();
  await dbQuery("insert into refreshtoken (token, user_id) values ($1, $2)", [
    refreshToken,
    id,
  ]);
  return { accessToken, refreshToken };
};

const verifyCodeLogic = async (email, userCode) => {
  const codeData = await select("users", "verification_code", email);
  const currentDate = new Date(Date.now());
  const { code, expires_in } = codeData;
  if (currentDate > expires_in) {
    await dbQuery("delete from verification_code where user_email = $1", [
      email,
    ]);
    throw new error.BadRequest("The code has expired generate a new code");
  }
  if (userCode !== code) {
    throw new error.BadRequest("Double check your code again");
  }
};

const forgotPasswordLogic = async (email) => {
  const user = await getUserFromDb(email);
  if (user.rows.length === 0) {
    throw new error.NotFound("Credentials not found please try again");
  }
  const code = await createVerificationCode(email);
  await sendVerificationEmail(email, code);
};

const resetPasswordLogic = async (email, newPassword, repeatPassword) => {
  if (repeatPassword !== newPassword) {
    throw new error.BadRequest(
      "Typed credentials does not match please try again"
    );
  }
  const hashedPassword = await hashPassword(repeatPassword);
  const appliedNewPassword = await dbQuery(
    "update users set password = $1 where email = $2",
    [hashedPassword, email]
  );
  console.log(appliedNewPassword);
};

const sendNewCodeLogic = async (email) => {
  const code = await createVerificationCode(email);
  await sendVerificationEmail(email, code);
};

const sendNewAccessTokenLogic = async (email) => {
  const token = await select("refreshtoken", "email", email);
  if (token) {
    const user = await select("users", "email", email);
    const { username, id } = user;
    const payload = createPayload(username, id);
    const newAccessToken = createJWT(payload);
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
