const handleInvalidEndpoints = (req, res) => {
    handleCustomErrors({ status: 404, msg: 'error: invalid endpoint'}, req, res);
}

const handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
    else next(err);
}

const handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '22P02') res.status(400).send({ msg: "error: invalid input" });
    else next(err);
}

const handle500Errors = (err, req, res) => {
    res.status(500).send({ msg: "internal server error" });
}

module.exports = {
    handleCustomErrors,
    handleInvalidEndpoints,
    handlePsqlErrors,
    handle500Errors
};