'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            'users',
            [
                {
                    name: 'Matheus Donatoni',
                    email: 'matheus.donatoni@gmail.com.br',
                    password:
                        '$2a$10$7nBYMgrtxc4Qok5skYtsUudaK0xn2R2nibE54GEq2HTlFEoef9cTG',
                    unitId: 1,
                    roleId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {
                hooks: false,
            }
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('users', null, {});
    },
};
