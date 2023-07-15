const { query } = require('../db');

module.exports = {
    getPrinterCellPrinter,
};

async function getPrinterCellPrinter(labelType) {
    try {
    const printer = await query('SELECT * FROM ra_labels WHERE label = $1', [labelType]);
    return printer?.rows[0]?.print_cell_printer;
    } catch (error) {
        console.log('Error in getPrinterCellPrinter: ', error);
        return null;
    }
}
