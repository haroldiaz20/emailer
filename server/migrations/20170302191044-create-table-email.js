'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        /*
         Add altering commands here.
         Return a promise to correctly handle asynchronicity.
         
         Example:
         
         */
        return queryInterface.createTable('email', {
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
            state: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            country: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            age: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            md5: {
                type: Sequelize.STRING(50),
                allowNull: true
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
                    'email',
                    ['email'],
                    {
                        indexName: 'EmailEmailIndex',
                        indicesType: 'UNIQUE'
                    }
            );
            queryInterface.addIndex(
                    'email',
                    ['md5'],
                    {
                        indexName: 'Md5EmailIndex',
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
         
         */
        return queryInterface.dropTable('email');
    }
};
