'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

     return queryInterface.addColumn(
      'email_open',
      'sent_at',
      {
         type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');

    */

    return queryInterface.removeColumn('email_open', 'sent_at');
  }
};
