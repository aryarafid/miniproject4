// Set up MySQL connection
const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "attendance",
});

const host = 

module.exports = pool;
