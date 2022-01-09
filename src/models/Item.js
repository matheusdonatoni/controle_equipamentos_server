const { Model, DataTypes } = require('sequelize');

class Item extends Model {
    static init(connection) {
        super.init(
            {
                name: DataTypes.STRING,
                description: DataTypes.STRING,
                code: DataTypes.STRING,
            },
            {
                sequelize: connection,
                modelName: 'item',
            }
        );
    }

    static associate(models) {
        this.belongsToMany(models.category, {
            foreignKey: 'itemId',
            through: 'category_items',
        });
        this.belongsTo(models.measurement, { foreignKey: 'measurementId' });
        this.belongsTo(models.picture, { foreignKey: 'pictureId' });
    }
}

module.exports = Item;
