//index.js
const express = require("express");
const json = require("body-parser").json;
const app = express();
const cors = require("cors");
const { query } = require("./db");

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
const ipAddress = "10.76.18.71";
const port = 9100;
const zpl =
  "^XA^CF0,60^FO220,50^FD Javascript 3 ^FS^CF0,50^FO220,115^FD Test ^FS^XZ";

/// ROUTES ///

//get all orders from orders table
app.get("/orders", async (req, res) => {
  try {
    const allOrders = await query("SELECT * FROM orders");
    res.json(allOrders.rows);
  } catch (err) {
    console.error("Error: ", err.message);
  }
});
//add order to orders table
app.post("/orders", async (req, res) => {
  try {
    const {
      category,
      description,
      labelType,
      orderNumber,
      orderType,
      user,
      content,
    } = req.body;
    const text =
      'INSERT INTO orders ("category", "description", "labelType", "order_number", "order_type", "user", "content")' +
      " VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;";
    const values = [
      category,
      description,
      labelType,
      orderNumber,
      orderType,
      user,
      content,
    ];
    const newOrder = await query(text, values);
    res.json(newOrder.rows[0]);
  } catch (err) {
    console.error(err.stack);
  }
});

//get all users

app.get("/users", async (req, res) => {
  try {
    const allUsers = await query("SELECT * FROM ra_users");
    res.json(allUsers.rows);
  } catch (err) {
    console.error("Error: ", err.message);
  }
});

// add user
app.post("/users", async (req, res) => {
  //printToZebra(ipAddress, port, zpl);
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

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
