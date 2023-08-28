const handleInvalidEndpoints = (req, res) => {
    handleCustomErrors({ status: 404, msg: 'error: invalid endpoint'}, req, res);
}

const handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
    else next(err);
}

const handlePsqlErrors = (err, req, res, next) => {
    const code_responses = {
        '22P02': 'invalid input',
        '23503': 'user not registered',
        '42703': 'column does not exist',
        '42601': 'syntax error'
    };
    if (Object.keys(code_responses).includes(err.code))
        res.status(400).send({ msg: `error: ${code_responses[err.code]}` });
    else
        next(err);
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