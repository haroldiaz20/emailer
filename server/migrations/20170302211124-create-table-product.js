'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        /*
         Add altering commands here.
         Return a promise to correctly handle asynchronicity.
         
         Example:
         */
        return queryInterface.createTable('product', {
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
                type: Sequelize.STRING(100),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            path: {
                type: Sequelize.STRING(100),
                allowNull: false
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
        }).then(function () {
            queryInterface.addIndex(
                    'product',
                    ['value'],
                    {
                        indexName: 'ValueCampaignIndex',
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
        return queryInterface.dropTable('product');
    }
};
