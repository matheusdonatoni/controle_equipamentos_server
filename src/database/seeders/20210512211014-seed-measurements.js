'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('measurements', [
            {
                name: 'UN',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'MT',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'KG',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'BR',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('measurements', null, {});
    },
};
