/* jshint indent: 2 */

'use strict';

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        first_name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        last_name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        phone: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: "1"
        }
    }, {
        tableName: 'user'
    },{
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Campaign, {
              foreignKey: {
                name: 'id_user',
                allowNull: false
              }
        });

        User.hasMany(models.Product, {
              foreignKey: {
                name: 'id_user',
                allowNull: false
              }
        });

        User.hasMany(models.List, {
              foreignKey: {
                name: 'id_user',
                allowNull: false
              }
        });
       
      }
    }
  });
    return User;
};
