const { Model, DataTypes } = require('sequelize');

class Sector extends Model {
    static init(connection) {
        super.init(
            {
                name: DataTypes.STRING,
            },
            {
                sequelize: connection,
                modelName: 'sector',
            }
        );
    }

    static associate(models) {
        this.hasMany(models.machine, { foreignKey: 'sectorId' });
    }
}

module.exports = Sector;