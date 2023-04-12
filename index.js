//  index.js
const express = require('express');
const { json } = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const { query } = require('./db');
const { printOrder } = require('./utils/printOrder');
const { updateIsPrinted } = require('./utils/updateIsPrinted');

const app = express();
app.use(cors());

app.use(json());

app.use(helmet());
/// ROUTES ///

//  get all orders from orders table
app.get('/orders', async (req, res) => {
    try {
        console.log('get all orders');

        const allOrders = await query(
            '(SELECT * FROM orders WHERE "isPrinted" = false)' +
                ' UNION' +
                ' (SELECT * FROM orders WHERE "isPrinted" = true ORDER BY datetime DESC  LIMIT 5)'
        );

        if (allOrders.rowCount > 0) {
            res.status(200).json(allOrders.rows);
        } else {
            res.status(404).json('No orders found');
        }
    } catch (err) {
        console.error('Error: ', err.message);
    }
});

//  add order to orders table
app.post('/orders', async (req, res) => {
    try {
        const { category, description, labelType, orderNumber, orderType, user, content, workcenter } = req.body;

        const text =
            'INSERT INTO orders ("category", "description", "labelType", "order_number", "order_type", "user", "content","workcenter")' +
            ' VALUES ($1, $2, $3, $4, $5, $6, $7,$8) RETURNING *;';

        const values = [category, description, labelType, orderNumber, orderType, user, content, workcenter];
        const newOrder = await query(text, values);
        res.status(200).json(newOrder.rows[0]);

        console.log('new order added by the user: ', user);
    } catch (err) {
        console.error(err.stack);

        res.status(500).json(`Error: ${err.message}`);
    }
});

//  get all users

app.get('/users', async (req, res) => {
    try {
        console.log('get all users');

        const allUsers = await query('SELECT * FROM ra_users');
        if (allUsers.rowCount > 0) {
            res.status(200).json(allUsers.rows);
        } else {
            res.status(404).json('No users found');
        }
    } catch (err) {
        console.error('Error: ', err.message);

        res.status(500).json(`Error: ${err.message}`);
    }
});

// add user
app.post('/users', async (req, res) => {
    //  printToZebra(ipAddress, port, zpl);
    try {
        const { username, name, surname } = req.body;
        const newUser = await query('INSERT INTO ra_users (username, name, surname) VALUES ($1, $2, $3) RETURNING *', [
            username,
            name,
            surname,
        ]);

        res.json(newUser.rows[0]);
    } catch (err) {
        console.error('Error: ', err.message);

        res.status(500).json(`Error: ${err.message}`);
    }
});

//  delete user
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        //  console log the usernam of the user that is being deleted

        const deleteUser = await query('DELETE FROM ra_users WHERE "userID" = $1', [id]);
        const allUsers = await query('SELECT * FROM ra_users');
        res.json(allUsers.rows);
    } catch (err) {
        console.error('Error: ', err.stack);

        res.status(500).json(`Error: ${err.message}`);
    }
});

//  get all printers
app.get('/printers', async (req, res) => {
    try {
        const allPrinters = await query('SELECT * FROM printers');
        if (allPrinters.rowCount > 0) {
            res.status(200).json(allPrinters.rows);
        }
    } catch (err) {
        console.error('Error: ', err.message);

        res.status(500).json(`Error: ${err.message}`);
    }
});

//  add printer
app.post('/printers', async (req, res) => {
    try {
        const { printerName, printerIP, printerPort, printerDPI, workcenter } = req.body;

        const newPrinter = await query(
            'INSERT INTO printers ("printerName","printerIP","printerPort","printerDPI","workcenter") VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [printerName, printerIP, printerPort, printerDPI, workcenter]
        );

        res.json(newPrinter.rows[0]);
    } catch (err) {
        console.error('Error: ', err.message);

        res.status(500).json(`Error: ${err.message}`);
    }
});

//  delete printer
app.delete('/printers/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id);

        const printer = await query('SELECT * FROM printers WHERE "printerID" = $1', [id]);
        console.log(printer.rows);

        const deletePrinter = await query('DELETE FROM printers WHERE "printerID" = $1', [id]);
        res.json('Printer was deleted');
    } catch (err) {
        console.error('Error: ', err.message);

        res.status(500).json(`Error: ${err.message}`);
    }
});

//  get all labels
app.get('/labels', async (req, res) => {
    try {
        console.log('get all labels');

        const allLabels = await query('SELECT * FROM ra_labels');
        if (allLabels.rowCount > 0) {
            res.status(200).json(allLabels.rows);
        } else {
            res.status(404).json('No labels found');
        }
    } catch (err) {
        console.error('Error: ', err.message);

        res.status(500).json(`Error: ${err.message}`);
    }
});

//  update
//  add label
app.post('/labels', async (req, res) => {
    try {
        const {
            label,
            label_width,
            label_height,
            ribbon_width,
            label_x0,
            font_size,
            labels_in_row,
            print_cell_printer,
            lines_of_text,
        } = req.body;

        const newLabel = await query(
            'INSERT INTO ra_labels ("label", "label_width", "label_height", "ribbon_width", "label_x0", "font_size", "labels_in_row", "print_cell_printer", "lines_of_text") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [
                label,
                label_width,
                label_height,
                ribbon_width,
                label_x0,
                font_size,
                labels_in_row,
                print_cell_printer,
                lines_of_text,
            ]
        );

        res.json(newLabel.rows[0]);
    } catch (err) {
        console.error('Error: ', err.message);

        res.status(500).json(`Error: ${err.message}`);
    }
});

//  delete label
app.delete('/labels/:labelID', async (req, res) => {
    try {
        const { labelID } = req.params;
        const deleteLabel = await query('DELETE FROM "ra_labels" WHERE "labelID" = $1', [labelID]);
        res.json('Label was deleted');
    } catch (err) {
        console.error('Server Error: ', err.message);

        res.status(500).json(`Error: ${err.message}`);
    }
});

//  get plastic marks
app.get('/plasticmarks', async (req, res) => {
    try {
        const allPlasticMarks = await query('SELECT * FROM ra_plastic_marks');
        if (allPlasticMarks.rowCount > 0) {
            res.status(200).json(allPlasticMarks.rows);
        } else {
            res.status(404).json('No plastic marks found');
        }
    } catch (err) {
        console.error('Error: ', err.message);

        res.status(500).json(`Error: ${err.message}`);
    }
});

//  add plastic mark
app.post('/plasticmarks', async (req, res) => {
    try {
        const { mark, mark_description, max_length } = req.body;
        const newPlasticMark = await query(
            'INSERT INTO ra_plastic_marks ("mark", "mark_description", "max_length") VALUES ($1, $2, $3) RETURNING *',
            [mark, mark_description, max_length]
        );

        res.json(newPlasticMark.rows[0]);
    } catch (err) {
        console.error('Error: ', err.message);

        res.status(500).json(`Error: ${err.message}`);
    }
});

//  delete plastic mark
app.delete('/plasticmarks/:id', async (req, res) => {
    try {
        const { markID } = req.params;
        const deletePlasticMark = await query('DELETE FROM ra_plastic_marks WHERE "markID" = $1', [markID]);
        res.json('Plastic mark was deleted');
    } catch (err) {
        console.error('Error: ', err.message);

        res.status(500).json(`Error: ${err.message}`);
    }
});

// get all workcenters
app.get('/workcenters', async (req, res) => {
    console.log('get all workcenters');

    try {
        const allWorkcenters = await query('SELECT * FROM ra_workcenters');
        if (allWorkcenters.rowCount > 0) {
            console.log(allWorkcenters.rows);

            res.status(200).json(allWorkcenters.rows);
        } else {
            res.status(404).json('No workcenters found');
        }
    } catch (err) {
        console.error('Error: ', err.message);

        res.status(500).json(`Error: ${err.message}`);
    }
});

// add workcenter
app.post('/workcenters', async (req, res) => {
    try {
        const { workcenter, printableLabels } = req.body;
        const newWorkcenter = await query(
            'INSERT INTO ra_workcenters ("workcenter", "printableLabels") VALUES ($1, $2) RETURNING *',
            [workcenter, printableLabels]
        );

        res.json(newWorkcenter.rows[0]);
    } catch (err) {
        console.error('Error: ', err.message);

        res.status(500).json(`Error: ${err.message}`);
    }
});

// get printable labels for workcenter
app.get('/workcenters/:workcenter', async (req, res) => {
    try {
        const { workcenter } = req.params;
        const printableLabels = await query('SELECT "printableLabels" FROM ra_workcenters WHERE "workcenter" = $1', [
            workcenter,
        ]);

        if (printableLabels.rowCount > 0) {
            res.json(printableLabels.rows[0].printableLabels);
        } else {
            res.status(404).json('No printable labels found');
        }
    } catch (err) {
        console.error('Error: ', err.message);
    }
});

// delete workcenter
app.delete('/workcenters/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteWorkcenter = await query('DELETE FROM ra_workcenters WHERE "workcenterID" = $1', [id]);
        res.json('Workcenter was deleted');
    } catch (err) {
        console.error('Error: ', err.message);
    }
});

// post route to print
app.post('/print_cell/:id', async (req, res) => {
    try {
        const { id } = req.params;
        printOrder(id);

        res.json('Printed');
    } catch (err) {
        console.error('Error: ', err.message);
    }
});

app.post('/update_is_printed/:id', async (req, res) => {
    try {
        const { id } = req.params;
        updateIsPrinted(id);
    } catch (err) {
        console.error('Error: ', err.message);
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
