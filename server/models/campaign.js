/* jshint indent: 2 */

'use strict';

module.exports = function (sequelize, DataTypes) {
    var Campaign = sequelize.define('Campaign', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        status:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: "0",
        },
        value: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        friendly_from: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        body_html: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        link_click: {
            type: DataTypes.STRING(300),
            allowNull: false
        },
        link_unsubscribe: {
            type: DataTypes.STRING(300),
            allowNull: false
        },
        link_open: {
            type: DataTypes.STRING(300),
            allowNull: false
        },
        delivered: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        undelivered: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        datetime_start: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        },
        datetime_end: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: DataTypes.NOW
        }

    }, {
        tableName: 'campaign'
    },{
    classMethods: {
      associate: function(models) {
          Campaign.belongsToMany(models.Product, {
            through: 'CampaignProduct'
          });
          Campaign.belongsToMany(models.List, {
            through: 'CampaignList'
          });
          Campaign.belongsToMany(models.Email, {
            through: 'EmailOpen'
          });
       
      }
    }
  });

    return Campaign;
};
