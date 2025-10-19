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

const registerLogic = async (username, email, password) => {
  const alreadyRegistered = await getUserFromDb(email);
  if (alreadyRegistered.rows.length > 0) {
    throw new error.BadRequest("This email is already in use");
  }
  const hashedPassword = await hashPassword(password);
  const registered = await registerData(username, email, hashedPassword);

  const code = await createVerificationCode(email);
  await sendVerificationEmail(email, code);
  return registered;
};

const loginLogic = async (userEmail, userPassword) => {
  const user = await getUserFromDb(userEmail);
  if (user.rowCount === 0) {
    throw new error.BadRequest("Double check your credentials");
  }
  const account = user.rows[0];
  const { password, id, username } = account;
  const isTrue = await verifyPassword(userPassword, password);
  if (!isTrue) {
    throw new error.BadRequest("Double check your credentials");
  }
  const payload = createPayload(username, id);
  const token = createJWT(payload);
  const refreshToken = generateRefreshToken();
  await dbQuery("insert into refreshtoken (token, user_id) values ($1, $2)", [
    refreshToken,
    id,
  ]);
  return { token, refreshToken };
};

const verifyCodeLogic = async (email, userCode) => {
  const codeData = await dbQuery(
    "select * from verification_code where user_email = $1",
    [email]
  );
  const correctCode = codeData.rows[0];
  const currentDate = new Date(Date.now());
  const { code, expires_in } = correctCode;
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

module.exports = {
  registerLogic,
  loginLogic,
  verifyCodeLogic,
  forgotPasswordLogic,
  resetPasswordLogic,
  sendNewCodeLogic,
};
