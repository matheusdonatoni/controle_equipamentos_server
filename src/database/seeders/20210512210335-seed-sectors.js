'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('sectors', [
            {
                name: 'Mercado da Carne',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Carpaccio',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Espetinho',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Bloco',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'IQF',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Embalagem Secundária',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Expedição',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Paletização',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Recebimento',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Bife',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Preparação',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('sectors', null, {});
    },
};
