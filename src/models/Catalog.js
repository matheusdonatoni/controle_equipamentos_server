const { Model, DataTypes } = require('sequelize');

class Catalog extends Model {
    static init(connection) {
        super.init(
            {
                name: DataTypes.STRING,
            },
            {
                sequelize: connection,
                modelName: 'catalog',
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.unit, { foreignKey: 'unitId' });
        // this.hasMany(models.user, { foreignKey: 'unitId' });
        this.hasMany(models.machine, { foreignKey: 'catalogId' });
    }
}

module.exports = Catalog;
