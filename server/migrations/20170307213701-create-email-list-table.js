'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      
    */
    return queryInterface.createTable('email_list', { 
            is_active: {
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
    },{
            engine: 'InnoDB',
            charset: 'utf8',
            schema: 'public'
        });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('email_list');
  }
};
