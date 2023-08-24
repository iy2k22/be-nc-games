const {
    readCategories,
    readReview,
    readReviews,
    readCommentsByReview,
    putCommentOnReview
} = require('../models');
const resCodes = require('../res_codes.json');

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
        if (result === resCodes.REVIEW_NOT_FOUND)
            next({ status: 404, msg: `error: review with id ${review_id} does not exist` });
        else
            res.status(200).send({ review: result[0] });
    } catch (e) {
        next(e);
    }
}

const getReviews = async (req, res, next) => {
    try {
        const reviewData = await readReviews();
        res.status(200).send({ reviews: reviewData });
    } catch (e) {
        next(e);
    }
}

const getCommentsByReview = async (req, res, next) => {
    const review_id = Number.parseInt(req.params.review_id);
    if (!review_id) {
        next({ status: 400, msg: `error: review id must be a number`});
        return;
    }
    try {
        const result = await readCommentsByReview(review_id);
        switch (result) {
            case resCodes.REVIEW_NOT_FOUND:
                next({ status: 404, msg: `error: review with id ${review_id} does not exist` });
                break;
            case resCodes.NO_COMMENTS_FOR_REVIEW:
                next({ status: 404, msg: `error: no comments for review with id ${review_id}` });
                break;
            default:
                res.status(200).send({ comments: result });
                break;
        }
    } catch (e) {
        next(e);
    }
}

const postComment = async (req, res, next) => {
    const review_id = Number.parseInt(req.params.review_id);
    if (!review_id) {
        next({ status: 400, msg: 'error: review id must be a number' });
        return;
    }
    try {
        for (let prop of ['username', 'body'])
            if (!(req.body.hasOwnProperty(prop))) {
                next({ status: 400, msg: `error: request doesn't have '${prop}' property` });
                return;
            } else if (typeof req.body[prop] !== 'string') {
                next({ status: 400, msg: `error: '${prop}' must be a string` });
                return;
            }
        const result = await putCommentOnReview({
            username: req.body.username,
            body: req.body.body,
            review_id: review_id
        });
        if (result === resCodes.REVIEW_NOT_FOUND) {
            next({ status: 404, msg: `error: review with id ${review_id} does not exist` });
            return;
        }
        res.status(201).send({ comment: result });
    } catch (e) {
        next(e);
    }
}

module.exports = {
    getCategories,
    getEndpoints,
    getReview,
    getReviews,
    getCommentsByReview,
    postComment
}