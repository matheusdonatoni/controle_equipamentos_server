module.exports = (req, res, next) => {
    Object.keys(req.params).forEach(function (key) {
        if (req.params[key] === 'null') {
            req.params[key] = null;
        }
    });

    Object.keys(req.query).forEach(function (key) {
        if (req.query[key] === 'null') {
            req.query[key] = null;
        }
    });

    return next();
};
