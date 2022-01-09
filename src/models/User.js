const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
    static init(connection) {
        super.init(
            {
                name: DataTypes.STRING,
                email: DataTypes.STRING,
                password: { type: DataTypes.STRING },
            },
            {
                hooks: {
                    beforeSave: async (user, options) => {
                        if (user.password) {
                            const hash = await bcrypt.hash(user.password, 10);
                            user.password = hash;
                        }
                    },
                },
                defaultScope: {
                    attributes: {
                        exclude: ['password'],
                    },
                },
                sequelize: connection,
                modelName: 'user',
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.unit, {
            foreignKey: 'unitId',
        });
        this.belongsTo(models.picture, {
            foreignKey: 'pictureId',
        });
        this.hasMany(models.roleRequest, {
            foreignKey: 'requesterId',
            as: 'requester',
        });
        this.hasMany(models.roleRequest, {
            foreignKey: 'approverId',
            as: 'approver',
        });
        this.belongsToMany(models.machine, {
            foreignKey: 'userId',
            through: 'user_machines',
        });
        this.belongsTo(models.role, {
            foreignKey: {
                name: 'roleId',
                defaultValue: 1,
                allowNull: false,
            },
        });
    }
}

module.exports = User;
