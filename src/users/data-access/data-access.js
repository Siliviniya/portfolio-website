const { dbQuery } = require("../../config/index");
const registerData = async (username, email, password) => {
  const registered = await dbQuery(
    "insert into users (username, email, password) values ($1, $2, $3)",
    [username, email, password]
  );
  console.log(registered);
  return registered;
};

module.exports = { registerData };
