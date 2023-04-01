const { query } = require('../db');

module.exports = {
    fetchOrder,
};

async function fetchOrder(id) {
    const order = await query('SELECT * FROM orders WHERE id = $1', [id]);

    return order.rows[0];
}

fetchOrder(1).then(res => console.log(res));
