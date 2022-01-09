'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('machines', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            brand: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            model: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            tag: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            pictureId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'pictures',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            catalogId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'catalogs',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            sectorId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'sectors',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('machines');
    },
};
