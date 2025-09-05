import pool from "../config/db.js";

async function createUser(email, firstName, lastName,password) {
  const result = await pool.query(
    "INSERT INTO users (email,password,firstName,lastName) VALUES ($1, $2, $3, $4) RETURNING *",
    [email,password,firstName,lastName]
  );
  return result.rows[0];
}

async function getUsers() {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
}

export default{ createUser, getUsers };
