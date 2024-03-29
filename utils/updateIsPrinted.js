const { query } = require('../db');

module.exports = {
    updateIsPrinted,
};

async function updateIsPrinted(id) {
    try {
        const updateOrderTrue = await query('UPDATE orders SET "isPrinted" = true WHERE id = $1', [id]);
        console.log('Marked as done');
    } catch (error) {
        console.log('error: ', error);
    }
}
