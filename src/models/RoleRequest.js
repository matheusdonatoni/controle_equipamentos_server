const { Model, DataTypes, fn } = require('sequelize');

class RoleRequest extends Model {
    static init(connection) {
        super.init(
            {
                approved: DataTypes.BOOLEAN,
                repliedAt: DataTypes.DATE,
            },
            {
                sequelize: connection,
                modelName: 'roleRequest',
                tableName: 'role_requests',
            }
        );
    }

    static associate(models) {
        this.belongsTo(models.user, {
            foreignKey: 'requesterId',
            as: 'requester',
        });
        this.belongsTo(models.role, {
            foreignKey: 'requestedRoleId',
            as: 'requestedRole',
        });
        this.belongsTo(models.user, {
            foreignKey: 'approverId',
            as: 'approver',
        });
        this.belongsTo(models.unit, {
            foreignKey: 'unitId',
        });
    }
}

module.exports = RoleRequest;
