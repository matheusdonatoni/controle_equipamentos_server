const { Model, DataTypes } = require('sequelize');

class Role extends Model {
    static init(connection) {
        super.init(
            {
                name: DataTypes.STRING,
            },
            {
                sequelize: connection,
                modelName: 'role',
            }
        );
    }

    static associate(models) {
        this.hasMany(models.user, {
            foreignKey: 'roleId',
            defaultValue: 1,
        });
        this.hasMany(models.roleRequest, {
            foreignKey: 'requestedRoleId',
            as: 'requestedRole',
        });
    }
}

module.exports = Role;
