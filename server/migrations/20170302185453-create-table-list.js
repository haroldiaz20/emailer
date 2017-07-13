'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        /*
         Add altering commands here.
         Return a promise to correctly handle asynchronicity.
         
         Example:
         
         */
        return queryInterface.createTable('list', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            value: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            emails_number: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            is_enable: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
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
                    'list',
                    ['value'],
                    {
                        indexName: 'ValueListIndex',
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
        return queryInterface.dropTable('list');
    }
};
