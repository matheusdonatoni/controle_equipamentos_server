const { Model, DataTypes } = require('sequelize');

class Measurement extends Model {
    static init(connection) {
        super.init(
            {
                name: DataTypes.STRING,
            },
            {
                sequelize: connection,
                modelName: 'measurement',
            }
        );
    }

    static associate(models) {
        this.hasMany(models.item, { foreignKey: 'measurementId' });
    }
}

module.exports = Measurement;
