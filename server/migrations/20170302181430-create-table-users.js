'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        /*
         Add altering commands here.
         Return a promise to correctly handle asynchronicity.
         
         Example:
         return queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        return queryInterface.createTable('user', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            email: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            password: {
                type: Sequelize.STRING(60),
                allowNull: false
            },
            first_name: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            last_name: {
                type: Sequelize.STRING(20),
                allowNull: true
            },
            phone: {
                type: Sequelize.STRING(10),
                allowNull: true
            },
            image: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            address: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            token: {
                type: Sequelize.STRING(60),
                allowNull: false
            },
            type: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: "1"
            },
            createdAt: {
                type: Sequelize.DATE
            },
            updatedAt: {
                type: Sequelize.DATE
            }
        },
        {
            engine: 'InnoDB',
            charset: 'utf8',
            schema: 'public'
        }
        ).then(function () {
            queryInterface.addIndex(
                    'user',
                    ['email'],
                    {
                        indexName: 'EmailUserIndex',
                        indicesType: 'UNIQUE'
                    }
            );
        });
    },
    down: function (queryInterface, Sequelize) {
        /*
         Add reverting commands here.
         Return a promise to correctly handle asynchronicity.
         
         Example:
         return queryInterface.dropTable('users');
         */
        return queryInterface.dropTable('user');
    }
};
