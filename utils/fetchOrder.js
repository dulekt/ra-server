// import query from db file in the outside folder
// const { query } = require('../db');
const { query } = require('../db');

module.exports = {
    fetchOrder,
};

async function fetchOrder(id) {
    const order = await query('SELECT * FROM orders WHERE id = $1', [parseInt(id, 10)]);

    return order?.rows[0];
}

// fetchOrder(56);
