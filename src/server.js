require('dotenv').config();

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    process.env.APP_ADD = add;
});

const express = require('express');
const routes = require('./routes');

require('./database');

const app = express();

app.use(express.json());

/// Setup Static Access to Pictures
app.use('/uploads/pictures', express.static('./uploads/pictures'));

routes(app);

app.listen(process.env.APP_PORT);
