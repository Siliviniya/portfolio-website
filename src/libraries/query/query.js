const { dbQuery } = require("../../config/index");
const error = require("../errors");

const requestDb = async (text, value) => {
  const result = await dbQuery(text, [...value]);
  if (result.rows.length < 1) {
    throw new error.BadRequest("Invalid request please try again");
  }
  return result.rows;
};

module.exports = requestDb;
