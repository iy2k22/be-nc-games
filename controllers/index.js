const {
    readCategories
} = require('../models');

const getCategories = async (req, res, next) => {
    try {
        const categoryData = await readCategories();
        res.status(200).send({ categories: categoryData });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    getCategories
}