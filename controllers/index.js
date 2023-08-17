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

const getEndpoints = async (req, res) => {
    res.status(200).send({ endpoints: require('../endpoints.json') });
}

module.exports = {
    getCategories,
    getEndpoints
}