'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        /*
         Add altering commands here.
         Return a promise to correctly handle asynchronicity.
         
         Example:
         
         */
        return queryInterface.createTable('campaign_product', {
            id_campaign: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'campaign',
                    key: 'id'
                }
            },
            id_product: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'product',
                    key: 'id'
                }
            },
            createdAt: {
                type: Sequelize.DATE
            },
            updatedAt: {
                type: Sequelize.DATE
            }
        }, {
            engine: 'InnoDB',
            charset: 'utf8',
            schema: 'public'
        }).then(function () {
            queryInterface.addIndex(
                    'campaign_product',
                    ['id_campaign', 'id_product'],
                    {
                        indexName: 'IdCampaignIdProductIndex',
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
        return queryInterface.dropTable('campaign_product');
    }
};
