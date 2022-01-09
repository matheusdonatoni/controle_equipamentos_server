const queryString = require('query-string');

module.exports = (req, res, next) => {
    const { query } = queryString.parseUrl(req.url, {
        parseBooleans: true,
    });

    req.query = query;

    next();
};
