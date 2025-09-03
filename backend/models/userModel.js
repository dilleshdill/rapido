const pool = require("../config/db");

async function createUser(email, firstName, lastName) {
  const result = await pool.query(
    "INSERT INTO users (email,firstName,lastName) VALUES ($1, $2, $3) RETURNING *",
    [email,firstName,lastName]
  );
  console.log(email,firstName,lastName)
  return result.rows[0];
}

async function getUsers() {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
}

module.exports = { createUser, getUsers };
