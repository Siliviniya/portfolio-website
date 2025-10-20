const { dbQuery } = require("../../config/index");
const error = require("../../libraries/errors");

const select = async (table, column, values) => {
  const text = `select * from ${table} where ${column} = $1`;
  const result = await dbQuery(text, [values]);
  if (result.rows.length === 0) {
    throw new error.NotFound("Invalid credentials");
  }
  return result.rows[0];
};

module.exports = { select };
