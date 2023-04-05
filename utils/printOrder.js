const { query } = require('../db');
const { printToZebra } = require('./printToZebra');
const { prepareZPL } = require('./prepareZPL');
const { getPrinterCellPrinter } = require('./getPrinterCellPrinter');
const { fetchOrder } = require('./fetchOrder');

module.exports = {
    printOrder,
};

async function printOrder(id) {
    const { labelType, order_type, content } = await fetchOrder(id);
    if (order_type === 'Naklejki') {
        const printer = await getPrinterCellPrinter(labelType);
        const printerData = await query('SELECT * FROM printers WHERE "printerName" = $1', [printer]);
        const ipAddress = printerData?.rows[0]?.printerIP;
        const port = printerData?.rows[0]?.printerPort;
        const DPI = printerData?.rows[0]?.printerDPI;

        const labelData = await query('SELECT * FROM ra_labels WHERE label = $1 ', [labelType]);

        if (labelData.rows.length > 0) {
            const labelDataObj = labelData.rows[0];
            const { label_width, label_height, ribbon_width, font_size, label_x0, labels_in_row, lines_of_text } =
                labelDataObj;

            const zpl = prepareZPL(
                content,
                ribbon_width,
                label_width,
                label_height,
                DPI,
                font_size,
                labels_in_row,
                label_x0,
                lines_of_text
            );

            const updateOrder = await query('UPDATE orders SET "isPrinted" = true WHERE id = $1', [id]);
            printToZebra(ipAddress, port, zpl);
        } else {
            console.log('no label data');
        }
    } else {
        const updateOrderTrue = await query('UPDATE orders SET "isPrinted" = true WHERE id = $1', [id]);
        console.log('Pulsar zrobiony, dzieki mateusz');
    }
}
