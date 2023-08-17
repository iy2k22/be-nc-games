const db = require('../db/connection');

const readCategories = async () => {
    const result = await db.query(`SELECT * FROM categories;`);
    return result.rows;
}

module.exports = {
    readCategories
};