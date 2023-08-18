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
    getReview
} = require('./controllers');

app.use(cors());
app.use(express.json());

app.get('/api/categories', getCategories);
app.get('/api', getEndpoints);
app.get('/api/reviews/:review_id', getReview);

app.all('*', handleInvalidEndpoints);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500Errors);

module.exports = app;