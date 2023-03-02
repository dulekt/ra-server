const express = require("express");
const json = require("body-parser").json;
const app = express();
const cors = require("cors");
const { query } = require("./db");
const helmet = require("helmet");

async function printOrder(id) {
  const { labelType, order_type, content } = await fetchOrder(id);

  const printer = await getPrinterCellPrinter(labelType);
  console.log(printer);
  const printerData = await query(
    'SELECT * FROM printers WHERE "printerName" = $1',
    [printer]
  );
  const ipAddress = printerData.rows[0].printerIP;
  const port = printerData.rows[0].printerPort;
  const DPI = printerData.rows[0].printerDPI;

  const labelData = await query("SELECT * FROM ra_labels WHERE label = $1 ", [
    labelType,
  ]);
  const listOfLabels = content;

  const labelWidth = labelData.rows[0].label_width;
  const labelHeight = labelData.rows[0].label_height;
  const ribbonWidth = labelData.rows[0].ribbon_width;
  const fontSize = labelData.rows[0].font_size;
  const x_0 = labelData.rows[0].label_x0;
  const labelsInRow = labelData.rows[0].labels_in_row;
  const linesOfText = labelData.rows[0].lines_of_text;

  const zpl = preparePrintPayload(
    listOfLabels,
    ribbonWidth,
    labelWidth,
    labelHeight,
    DPI,
    fontSize,
    labelsInRow,
    x_0,
    linesOfText
  );
  console.log(zpl);
  console.log("IP: ", ipAddress);
  console.log("Port: ", port);

  const updateOrder = await query(
    'UPDATE orders SET "isPrinted" = true WHERE id = $1',
    [id]
  );
}

function printToZebra(ipAddress, port, zpl) {
  /*
      const net = require("net");
      const client = new net.Socket();
      console.log("Printed to Zebra");
      client.connect(port, ipAddress, () => {
        client.write(zpl);
        client.destroy();
      });*/
  console.log(zpl);
}

module.exports = {
  printOrder,
  printToZebra,
};

async function fetchOrder(id) {
  const order = await query("SELECT * FROM orders WHERE id = $1", [id]);

  return order.rows[0];
}

async function getPrinterCellPrinter(labelType) {
  const printer = await query("SELECT * FROM ra_labels WHERE label = $1", [
    labelType,
  ]);
  return printer.rows[0].print_cell_printer;
}

function preparePrintPayload(listOfLabels) {
  const prefix = "^";
  const beginLabelDefinition = `${prefix}XA`;

  const changeFont = (fontName, height, width) =>
    `${prefix}CF${fontName}${height ? `,${height}` : ""}${
      width ? `,${width}` : ""
    }`;

  const setPosition = (x, y, alignment) =>
    `${prefix}FO${x}${y ? `,${y}` : ""}${alignment ? `,${alignment}` : ""}`;

  const mode = (mode) => `${prefix}MM${mode}`;

  const cut = "C";

  const labelStart = `${prefix}FD`;
  const labelEnd = `${prefix}FS`;
  const endLabelDefinition = `${prefix}XZ`;

  // For list of label strings, create groups of 3
  //and join them with the commands
  const groupedLabels = listOfLabels.reduce((acc, item, index, array) => {
    if (index % 3 === 0) {
      acc.push(array.slice(index, index + 3));
    }
    return acc;
  }, []);

  const allLabels = groupedLabels.map(
    (group) =>
      `${beginLabelDefinition}${changeFont(0, 50)}${group.map(
        (label, index) => {
          const offset = 145 + index * 200;
          return `${setPosition(
            offset,
            25
          )} ${labelStart} ${label} ${labelEnd}`;
        }
      )}`
  );

  return ` ${allLabels} ${mode(cut)} ${endLabelDefinition}`;
}
