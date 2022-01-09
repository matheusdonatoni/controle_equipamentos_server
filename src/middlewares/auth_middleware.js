const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authentication;

    if (!authHeader)
        return res.status(401).send({
            error: 'Nenhuma token de autorização gerada.',
        });

    const parts = authHeader.split(' ');

    if (!(parts.length === 2))
        return res.status(401).send({
            error: 'Erro no token.',
        });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({
            error: 'Token em formato incorreto.',
        });

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err)
            return res.status(401).send({
                error: 'Token inválido/expirado.',
            });

        req.user = decoded.id;
        return next();
    });
};
