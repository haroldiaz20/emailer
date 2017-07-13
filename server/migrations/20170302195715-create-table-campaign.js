'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        /*
         Add altering commands here.
         Return a promise to correctly handle asynchronicity.
         
         Example:
         */
        return queryInterface.createTable('campaign', {
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
            subject: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            friendly_from: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            body_html: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            link_click: {
                type: Sequelize.STRING(300),
                allowNull: false
            },
            link_unsubscribe: {
                type: Sequelize.STRING(300),
                allowNull: false
            },
            link_open: {
                type: Sequelize.STRING(300),
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
        }
        ).then(function () {
            queryInterface.addIndex(
                    'campaign',
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
        return queryInterface.dropTable('campaign');
    }
};
