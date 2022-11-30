//index.js
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

/// ROUTES ///
// add user
app.post("/users", async (req, res) => {
  try {
    const { username, name, surname } = req.body;
    const newUser = await pool.query(
      "INSERT INTO ra_users (username, name, surname) VALUES ($1, $2, $3) RETURNING *",
      [username, name, surname]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error("Error: ", err.message);
  }
});

//remove user

//get all users

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
