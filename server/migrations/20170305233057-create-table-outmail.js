'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    
    */
     return queryInterface.createTable('outmail', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            host: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            port: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            is_secure: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                default: false
            },
            username: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            password: {
                type: Sequelize.STRING(50),
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
           
        });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      
    */
    return queryInterface.dropTable('outmail');
  }
};
