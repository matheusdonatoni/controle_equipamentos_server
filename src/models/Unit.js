const { Model, DataTypes } = require('sequelize');

class Unit extends Model {
    static init(connection) {
        super.init(
            {
                name: DataTypes.STRING,
                code: DataTypes.STRING,
            },
            {
                sequelize: connection,
                modelName: 'unit',
            }
        );
    }

    static associate(models) {
        this.hasMany(models.user, {
            foreignKey: 'unitId',
        });
        this.hasMany(models.roleRequest, {
            foreignKey: 'unitId',
        });
        this.hasOne(models.catalog, {
            foreignKey: 'unitId',
        });
    }
}

module.exports = Unit;
