const { Model, DataTypes } = require('sequelize');

class Category extends Model {
    static init(connection) {
        super.init(
            {
                name: DataTypes.STRING,
            },
            {
                sequelize: connection,
                modelName: 'category',
            }
        );
    }

    static associate(models) {
        this.hasMany(models.category, { foreignKey: 'categoryId' });
        this.belongsTo(models.category, { foreignKey: 'categoryId' });
        this.belongsTo(models.machine, { foreignKey: 'machineId' });
        this.belongsToMany(models.item, {
            foreignKey: 'categoryId',
            through: 'category_items',
        });
    }
}

module.exports = Category;
