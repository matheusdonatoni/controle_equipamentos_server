const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Catalog = require('../models/Catalog');
const User = require('../models/User');
const Machine = require('../models/Machine');
const Category = require('../models/Category');
const Item = require('../models/Item');
const Unit = require('../models/Unit');
const Picture = require('../models/Picture');
const Measurement = require('../models/Measurement');
const Role = require('../models/Role');
const Sector = require('../models/Sector');
const RoleRequest = require('../models/RoleRequest');

const connection = new Sequelize(dbConfig);

Catalog.init(connection);
User.init(connection);
Machine.init(connection);
Category.init(connection);
Item.init(connection);
Unit.init(connection);
Picture.init(connection);
Measurement.init(connection);
Role.init(connection);
Sector.init(connection);
RoleRequest.init(connection);

Catalog.associate(connection.models);
User.associate(connection.models);
Unit.associate(connection.models);
Machine.associate(connection.models);
Category.associate(connection.models);
Item.associate(connection.models);
Picture.associate(connection.models);
Measurement.associate(connection.models);
Role.associate(connection.models);
Sector.associate(connection.models);
RoleRequest.associate(connection.models);

module.exports = connection;
