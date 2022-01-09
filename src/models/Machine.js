const { Model, DataTypes } = require('sequelize');

class Machine extends Model {
    static init(connection) {
        super.init(
            {
                name: DataTypes.STRING,
                brand: DataTypes.STRING,
                code: DataTypes.STRING,
                model: DataTypes.STRING,
                tag: DataTypes.STRING,
            },
            {
                sequelize: connection,
                modelName: 'machine',
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.catalog, { foreignKey: 'catalogId' });
        this.belongsTo(models.sector, { foreignKey: 'sectorId' });
        this.belongsTo(models.picture, { foreignKey: 'pictureId' });
        this.hasMany(models.category, { foreignKey: 'machineId' });
        this.belongsToMany(models.user, {
            foreignKey: 'machineId',
            through: 'user_machines',
        });
    }
}

module.exports = Machine;
