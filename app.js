const express = require('express');
const cors = require('cors');
const app = express();
const {
   handleCustomErrors,
   handleInvalidEndpoints,
   handle500Errors,
   handlePsqlErrors
} = require('./errors');
const {
    getCategories,
    getEndpoints,
    getReview,
    getReviews,
    getCommentsByReview,
    postComment,
    patchReview,
    deleteComment
} = require('./controllers');

app.use(cors());
app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api', getEndpoints);
app.get('/api/reviews/:review_id', getReview);
app.get('/api/reviews', getReviews);
app.get('/api/reviews/:review_id/comments', getCommentsByReview);
app.post('/api/reviews/:review_id/comments', postComment);
app.patch('/api/reviews/:review_id', patchReview)
app.delete('/api/comments/:comment_id', deleteComment);

app.all('*', handleInvalidEndpoints);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500Errors);

module.exports = app;