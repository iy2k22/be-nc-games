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
    getCategories
} = require('./controllers');

app.use(cors());
app.use(express.json());

app.get('/api/categories', getCategories);

app.all('*', handleInvalidEndpoints);
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handle500Errors);

module.exports = app;