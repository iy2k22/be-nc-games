const {
    readCategories,
    readReview
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

const getReview = async (req, res, next) => {
    const review_id = Number.parseInt(req.params.review_id);
    if (!review_id) {
        next({ status: 400, msg: "error: review id must be a number" });
        return;
    }
    try {
        const result = await readReview(review_id);
        if (!result)
            next({ status: 404, msg: `error: review with id ${review_id} does not exist` });
        else
            res.status(200).send({ review: result[0] });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    getCategories,
    getEndpoints,
    getReview
}