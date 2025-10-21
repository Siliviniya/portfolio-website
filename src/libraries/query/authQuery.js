const { dbQuery } = require("../../config/index");
const error = require("../errors");

const select = async (table, column, value) => {
  const text = `select * from ${table} where ${column} = $1`;
  const result = await dbQuery(text, [value]);
  if (result.rows.length === 0) {
    throw new error.NotFound("Invalid credentials");
  }
  return result.rows[0];
};

const insert = async (table, column, values) => {
  const placeholders = values.map((_, index) => {
    return `$${index + 1}`;
  });
  const text = `insert into ${table} (${column}) values (${placeholders})`;
  await dbQuery(text, [...values]);
};

const update = async (table, column, filter, values) => {
  const text = `update ${table} set ${column} = $1 where ${filter} = $2`;
  await dbQuery(text, [...values]);
};

const deleteData = async (table, column, values) => {
  const text = `delete from ${table} where ${column} = $1`;
  await dbQuery(text, [values]);
};

module.exports = { select, insert, update, deleteData };
