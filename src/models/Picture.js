const { Model, DataTypes } = require('sequelize');

class Picture extends Model {
    static init(connection) {
        super.init(
            {
                url: DataTypes.STRING,
                key: DataTypes.VIRTUAL,
                name: DataTypes.STRING,
                size: DataTypes.DOUBLE,
            },
            {
                hooks: {
                    beforeSave: async (picture, options) => {
                        picture.url = `http://${process.env.APP_ADD}:${process.env.APP_PORT}/uploads/pictures/${picture.key}`;
                    },
                },
                sequelize: connection,
                modelName: 'picture',
            }
        );
    }

    static associate(models) {
        this.hasMany(models.user, { foreignKey: 'pictureId' });
        this.hasMany(models.machine, { foreignKey: 'pictureId' });
        this.hasMany(models.item, { foreignKey: 'pictureId' });
    }
}

module.exports = Picture;
