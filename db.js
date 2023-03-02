//db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "postgres",
  host: "0.0.0.0",
  port: 5432,
  database: "ra",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
