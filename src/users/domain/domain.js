const error = require("../../libraries/errors");
const {
  hashPassword,
  verifyPassword,
  createJWT,
  verifyJWT,
} = require("../../libraries/index");
const { dbQuery } = require("../../config/index");
const { registerData } = require("../data-access/data-access");

const registerLogic = async (username, email, password) => {
  if (!username || !email || !password) {
    throw new error.BadRequest("All field must be filled");
  }
  const alreadyRegistered = await dbQuery(
    "select * from users where email = $1",
    [email]
  );
  if (alreadyRegistered.rows.length > 0) {
    throw new error.BadRequest("This email is already in use");
  } else {
    const hashedPassword = await hashPassword(password);
    const registered = await registerData(username, email, hashedPassword);
    return registered;
  }
};

const loginLogic = async (userEmail, userPassword) => {
  if (!userEmail || !userPassword) {
    throw new error.BadRequest("All field must be filled");
  }
  const alreadyExists = await dbQuery("select * from users where email = $1", [
    userEmail,
  ]);
  console.log(alreadyExists);
  if (alreadyExists.rowCount === 0) {
    throw new error.BadRequest("Double check your credentials");
  }
  const account = alreadyExists.rows[0];
  const { password, id } = account;
  const isTrue = await verifyPassword(userPassword, password);
  if (!isTrue) {
    throw new error.BadRequest("Double check your credentials");
  }
};

module.exports = { registerLogic, loginLogic };
