import pool from "../config/db.js";

async function createUser(email, firstName, lastName,hashedpassword) {
  console.log(email, firstName, lastName,hashedpassword)
  const result = await pool.query(
    "INSERT INTO users (email,password,firstname,lastname) VALUES ($1, $2, $3, $4) RETURNING *",
    [email,hashedpassword,firstName,lastName]
  );
  return result.rows[0];
}

async function getUsers() {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
}

export default{ createUser, getUsers };
