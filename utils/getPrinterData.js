const { query } = require('../db');
const { getPrinterCellPrinter } = require('./getPrinterCellPrinter');
const { fetchOrder } = require('./fetchOrder');

module.exports = {
    getPrinterData,
};

async function getPrinterData(id) {
    const { labelType, order_type } = await fetchOrder(id);
    if (order_type === 'Naklejki') {try {
        const printer = await getPrinterCellPrinter(labelType);
        const printerData = await query('SELECT * FROM printers WHERE "printerName" = $1', [printer]);
        const ipAddress = printerData?.rows[0]?.printerIP;
        const port = printerData?.rows[0]?.printerPort;
        const DPI = printerData?.rows[0]?.printerDPI;

        return { ipAddress, port, DPI };}
    catch (error) {
        console.log('Error in getPrinterData: ', error);
        return { ipAddress: null, port: null, DPI: null };
    }

    }

    console.log('Not a label order');

    return { ipAddress: null, port: null, DPI: null };
}
