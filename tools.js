const express = require("express");
const { query } = require("./db");
const net = require("net");
const client = new net.Socket();

async function printOrder(id) {
  const { labelType, order_type, content } = await fetchOrder(id);

  const printer = await getPrinterCellPrinter(labelType);
  console.log("printer", printer);
  const printerData = await query(
    'SELECT * FROM printers WHERE "printerName" = $1',
    [printer]
  );
  console.log("printerDataxx", printerData.rows[0]);

  const ipAddress = printerData?.rows[0]?.printerIP;
  const port = printerData?.rows[0]?.printerPort;
  const DPI = printerData?.rows[0]?.printerDPI;

  const labelData = await query("SELECT * FROM ra_labels WHERE label = $1 ", [
    labelType,
  ]);
  const listOfLabels = content;
  const labelWidth = labelData?.rows[0]?.label_width;
  const labelHeight = labelData?.rows[0]?.label_height;
  const ribbonWidth = labelData?.rows[0]?.ribbon_width;
  const fontSize = labelData?.rows[0]?.font_size;
  const x_0 = labelData?.rows[0]?.label_x0;
  const labelsInRow = labelData?.rows[0]?.labels_in_row;
  const linesOfText = labelData?.rows[0]?.lines_of_text;
  console.log(
    "linesOfText",
    linesOfText,
    "\nlabelsInRow",
    labelsInRow,
    "\nlabelWidth",
    labelWidth,
    "\nlabelHeight",
    labelHeight,
    "\nribbonWidth",
    ribbonWidth,
    "\nfontSize",
    fontSize,
    "\nDPI",
    DPI,
    "\nx_0",
    x_0,
    "\nlistOfLabels",
    listOfLabels
  );
  const zpl = prepareZPL(
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

  const updateOrder = await query(
    'UPDATE orders SET "isPrinted" = true WHERE id = $1',
    [id]
  );

  printToZebra(ipAddress, port, zpl);
}

function printToZebra(ipAddress, port = 9100, zpl) {
  console.log(zpl);

  client.connect(port, "10.76.13.150", () => {
    client.write(zpl);

    client.destroy();
  });
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
  //  console.log("labelType", labelType);
  const printer = await query("SELECT * FROM ra_labels WHERE label = $1", [
    labelType,
  ]);
  //console.log("getPrinterCellPrinter", printer.rows[0].print_cell_printer);
  return printer?.rows[0]?.print_cell_printer;
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
      )}${endLabelDefinition}\n`
  );

  return ` ${allLabels} ${mode(cut)} ${endLabelDefinition}`;
}
function prepareZPL(
  listOfLabels,
  ribbonWidth,
  labelWidth,
  labelHeight,
  DPI = 203,
  fontSize = 12,
  labelsInRow = 1,
  x_0 = 0,
  x_n = 0,
  linesOfText = 1
) {
  //console log parameteres
  const ribbonWidthInDots = Math.round((ribbonWidth * DPI) / 25.4);
  x_0 = Math.round((x_0 * DPI) / 25.4);
  x_n = Math.round((x_n * DPI) / 25.4);
  console.log("x_0, x_n: ", x_0, x_n);
  const beginLabelDefinition = "\n^XA";
  const endLabelDefinition = " ^XZ";
  const mode = "\n^XA\n^MMC\n^XZ";
  const labelWidthInDots = Math.round((labelWidth * DPI) / 25.4);
  const labelHeightInDots = Math.round((labelHeight * DPI) / 25.4);

  //?const fontSizeInDots = Math.round((fontSize * DPI) / 72);
  const fontSizeInDots = Math.round((fontSize * DPI) / 96);

  const fontZPL = "\n^CF0," + fontSizeInDots;
  //?  x position of 1. label left edge
  //const x0 = ribbonWidthInDots / (labelsInRow * 2) - labelWidthInDots / 2;

  // labels divided in groups of n where n is number of labels in row
  const groupedLabels = listOfLabels?.reduce((acc, item, index, array) => {
    if (index % labelsInRow === 0) {
      acc.push(array.slice(index, index + labelsInRow));
    }
    return acc;
  }, []);

  const labelsZPL = groupedLabels?.map(
    (group) =>
      beginLabelDefinition +
      group
        .map((label, index) => {
          const x = Math.round(
            x_0 + (index * (ribbonWidthInDots - x_0 - x_n)) / labelsInRow
          ); // x position of label

          const y = Math.round((labelHeightInDots - fontSizeInDots) / 4); // y position of label
          console.log("index,x,y  ", index, x, y);
          return `\n^FO${x},${y} ^FB${labelWidthInDots},${linesOfText},0,C\n^FD${label}\\&^FS`;
        })
        .join("") +
      endLabelDefinition
  );

  return beginLabelDefinition + fontZPL + labelsZPL + mode;
}
