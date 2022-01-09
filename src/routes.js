const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    fs.readdirSync(__dirname + '\\controllers')
        .filter((file) => file.indexOf('.') !== 0)
        .forEach((file) =>
            require(path.resolve(__dirname + '\\controllers', file))(app)
        );
};
