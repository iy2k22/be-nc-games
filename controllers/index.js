const {
    readCategories,
    readReview,
    readReviews,
    readCommentsByReview,
    putCommentOnReview,
    changeVotes,
    removeComment,
    readUsers
} = require('../models');
const resCodes = require('../res_codes.json');
const errCodes = require('../errors/msg');

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
        next(errCodes.INVALID_ID('review'));
        return;
    }
    try {
        const result = await readReview(review_id);
        if (result === resCodes.NOT_FOUND)
            next(errCodes.NOT_FOUND(review_id, 'review'));
        else
            res.status(200).send({ review: result });
    } catch (e) {
        next(e);
    }
}

const getReviews = async (req, res, next) => {
    const params = {
        category: undefined,
        sort_by: undefined,
        order: undefined
    }
    if (Object.keys(params).length !== 0)
        for (let prop in params)
            if (req.query.hasOwnProperty(prop))
                if (typeof req.query[prop] !== 'string') {
                    next(errCodes.INVALID_TYPE(prop, 'string'));
                    return;
                } else
                    params[prop] = req.query[prop];
    try {
        const reviewData = await readReviews(category = params.category, sort_by = params.sort_by, order = params.order);
        res.status(200).send({ reviews: reviewData });
    } catch (e) {
        next(e);
    }
}

const getCommentsByReview = async (req, res, next) => {
    const review_id = Number.parseInt(req.params.review_id);
    if (!review_id) {
        next(errCodes.INVALID_ID('review'));
        return;
    }
    try {
        const result = await readCommentsByReview(review_id);
        switch (result) {
            case resCodes.NOT_FOUND:
                next(errCodes.NOT_FOUND(review_id, 'review'));
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
        next(errCodes.INVALID_ID('review'));
        return;
    }
    for (let prop of ['username', 'body'])
        if (!(req.body.hasOwnProperty(prop))) {
            next(errCodes.DOES_NOT_HAVE_PROP(prop));
            return;
        } else if (typeof req.body[prop] !== 'string') {
            next(errCodes.INVALID_TYPE(prop, 'string'));
            return;
        }
    try {
        const result = await putCommentOnReview({
            username: req.body.username,
            body: req.body.body,
            review_id: review_id
        });
        if (result === resCodes.NOT_FOUND) {
            next(errCodes.NOT_FOUND(review_id, 'review'));
            return;
        }
        res.status(201).send({ comment: result });
    } catch (e) {
        next(e);
    }
}

const patchReview = async (req, res, next) => {
    const review_id = Number.parseInt(req.params.review_id);
    if (!review_id) {
        next(errCodes.INVALID_ID('review'));
        return;
    }
    if (!(req.body.hasOwnProperty('inc_votes'))) {
        next(errCodes.DOES_NOT_HAVE_PROP('inc_votes'));
        return;
    }
    if (typeof req.body.inc_votes !== 'number') {
        next(errCodes.INVALID_TYPE('inc_votes', 'number'));
        return;
    }
    try {
        const result = await changeVotes(review_id, req.body.inc_votes);
        if (result === resCodes.NOT_FOUND) {
            next(errCodes.NOT_FOUND(review_id, 'review'));
            return;
        }
        res.status(200).send({ review: result });
    } catch (e) {
        next(e);
    }
}

const deleteComment = async (req, res, next) => {
    const comment_id = Number.parseInt(req.params.comment_id);
    if (!comment_id) {
        next(errCodes.INVALID_ID('comment'));
        return;
    }
    try {
        const result = await removeComment(comment_id);
        if (result === resCodes.NOT_FOUND) {
            next(errCodes.NOT_FOUND('comment'));
            return;
        }
        res.status(204).send();
    } catch (e) {
        next(e);
    }
}

const getUsers = async (req, res, next) => {
    try {
        const users = await readUsers();
        res.status(200).send({ users: users });
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
    postComment,
    patchReview,
    deleteComment,
    getUsers
}