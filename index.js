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
      workcenter,
    } = req.body;
    const text =
      'INSERT INTO orders ("category", "description", "labelType", "order_number", "order_type", "user", "content","workcenter")' +
      " VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *;";
    const values = [
      category,
      description,
      labelType,
      orderNumber,
      orderType,
      user,
      content,
      workcenter,
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
//delete user
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //console log the usernam of the user that is being deleted

    const deleteUser = await query('DELETE FROM ra_users WHERE "userID" = $1', [
      id,
    ]);
    const allUsers = await query("SELECT * FROM ra_users");
    res.json(allUsers.rows);
  } catch (err) {
    console.error("Error: ", err.stack);
  }
});
//get all printers
app.get("/printers", async (req, res) => {
  try {
    const allPrinters = await query("SELECT * FROM printers");
    res.json(allPrinters.rows);
  } catch (err) {
    console.error("Error: ", err.message);
  }
});
//add printer
app.post("/printers", async (req, res) => {
  try {
    const { printerName, printerIP, printerPort, printerDPI, workcenter } =
      req.body;
    const newPrinter = await query(
      'INSERT INTO printers ("printerName","printerIP","printerPort","printerDPI","workcenter") VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [printerName, printerIP, printerPort, printerDPI, workcenter]
    );
    res.json(newPrinter.rows[0]);
  } catch (err) {
    console.error("Error: ", err.message);
  }
});
//delete printer
app.delete("/printers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const printer = await query(
      'SELECT * FROM printers WHERE "printerID" = $1',
      [id]
    );
    console.log(printer.rows);
    const deletePrinter = await query(
      'DELETE FROM printers WHERE "printerID" = $1',
      [id]
    );
    res.json("Printer was deleted");
  } catch (err) {
    console.error("Error: ", err.message);
  }
});

//get all labels
app.get("/labels", async (req, res) => {
  try {
    const allLabels = await query("SELECT * FROM ra_labels");
    res.json(allLabels.rows);
  } catch (err) {
    console.error("Error: ", err.message);
  }
});
//update
//add label
app.post("/labels", async (req, res) => {
  try {
    const {
      label,
      label_description,
      font_size,
      max_length,
      labels_in_row,
      suported_printers,
    } = req.body;
    const newLabel = await query(
      'INSERT INTO ra_labels ("label", "label_description", "font_size", "max_length", "labels_in_row", "suported_printers") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [
        label,
        label_description,
        font_size,
        max_length,
        labels_in_row,
        suported_printers,
      ]
    );
    res.json(newLabel.rows[0]);
  } catch (err) {
    console.error("Error: ", err.message);
  }
});
//delete label
app.delete("/labels/:id", async (req, res) => {
  try {
    const { labelID } = req.params;
    const deleteLabel = await query(
      'DELETE FROM ra_labels WHERE "labelID" = $1',
      [labelID]
    );
    res.json("Label was deleted");
  } catch (err) {
    console.error("Error: ", err.message);
  }
});

//get plastic marks
app.get("/plasticmarks", async (req, res) => {
  try {
    const allPlasticMarks = await query("SELECT * FROM ra_plastic_marks");
    res.json(allPlasticMarks.rows);
  } catch (err) {
    console.error("Error: ", err.message);
  }
});
//add plastic mark
app.post("/plasticmarks", async (req, res) => {
  try {
    const { mark, mark_description, max_length } = req.body;
    const newPlasticMark = await query(
      'INSERT INTO ra_plastic_marks ("mark", "mark_description", "max_length") VALUES ($1, $2, $3) RETURNING *',
      [mark, mark_description, max_length]
    );
    res.json(newPlasticMark.rows[0]);
  } catch (err) {
    console.error("Error: ", err.message);
  }
});
//delete plastic mark
app.delete("/plasticmarks/:id", async (req, res) => {
  try {
    const { markID } = req.params;
    const deletePlasticMark = await query(
      'DELETE FROM ra_plastic_marks WHERE "markID" = $1',
      [markID]
    );
    res.json("Plastic mark was deleted");
  } catch (err) {
    console.error("Error: ", err.message);
  }
});

//get all workcenters
app.get("/workcenters", async (req, res) => {
  try {
    const allWorkcenters = await query("SELECT * FROM ra_workcenters");
    res.json(allWorkcenters.rows);
  } catch (err) {
    console.error("Error: ", err.message);
  }
});
//add workcenter
app.post("/workcenters", async (req, res) => {
  try {
    const { workcenter, printableLabels } = req.body;
    const newWorkcenter = await query(
      'INSERT INTO ra_workcenters ("workcenter", "printableLabels") VALUES ($1, $2) RETURNING *',
      [workcenter, printableLabels]
    );
    res.json(newWorkcenter.rows[0]);
  } catch (err) {
    console.error("Error: ", err.message);
  }
});
//delete workcenter
app.delete("/workcenters/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteWorkcenter = await query(
      'DELETE FROM ra_workcenters WHERE "workcenterID" = $1',
      [id]
    );
    res.json("Workcenter was deleted");
  } catch (err) {
    console.error("Error: ", err.message);
  }
});

//post route to print
app.get("/print_cell/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const print = await query("SELECT * FROM orders WHERE id = $1", [id]);
    console.log(print.rows[0]);
    const { labelType, orderType, content } = print.rows[0];
    const printers = await query(
      "SELECT print_cell_printer FROM ra_labels WHERE label = $1",
      [labelType]
    );
    const suported_printers = printers.rows[0];

    res.json(suported_printers);
  } catch (err) {
    console.error("Error: ", err.message);
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
