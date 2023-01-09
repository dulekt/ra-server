//index.js
import express, { json } from "express";
const app = express();
import cors from "cors";
import { query } from "./db";

app.use(cors());
app.use(json());

function printToZebra(ipAddress, port, zpl) {
  const net = require("net");
  const client = new net.Socket();
  console.log("Printed to Zebra");
  client.connect(port, ipAddress, () => {
    client.write(zpl);
    client.destroy();
  });
}
const ipAddress = "10.76.13.191";
const port = 9100;
const zpl =
  "^XA^CF0,60^FO220,50^FD Javascript 3 ^FS^CF0,50^FO220,115^FD Test ^FS^XZ";

/// ROUTES ///
// add user
app.post("/users", async (req, res) => {
  printToZebra(ipAddress, port, zpl);
  try {
    const { username, name, surname } = req.body;
    const newUser = await query(
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
