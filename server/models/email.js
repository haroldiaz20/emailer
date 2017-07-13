/* jshint indent: 2 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  var Email = sequelize.define('Email', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    state: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "0"
    },
    country: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    md5: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    sexo: {
      type: DataTypes.ENUM('M', 'F', 'NE') ,
      allowNull:false,
      defaultValue: 'NE',
    }
  }, {
    tableName: 'email'
  },{
    classMethods: {
      associate: function(models) {
          Email.belongsToMany(models.List, {
            through: 'EmailList'
          });
          

          Email.belongsToMany(models.Campaign, {
            through: 'EmailOpen'
          });
      }
    }
  });
  
  return Email;
};
