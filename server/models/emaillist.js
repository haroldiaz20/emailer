/* jshint indent: 2 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  var EmailList = sequelize.define('EmailList', {   
    state: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "0"
    }
  }, {
    tableName: 'email_list'
  });
  
  return EmailList;
};
