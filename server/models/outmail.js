/* jshint indent: 2 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  var Outmail = sequelize.define('Outmail', {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true
            },
            host: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            port: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            is_secure: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                default: false
            },
            username: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            password: {
                type: DataTypes.STRING(50),
                allowNull: false
            }
  }, {
    tableName: 'outmail'
  });
  
  return Outmail;
};
