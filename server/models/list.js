/* jshint indent: 2 */
'use strict';

module.exports = function (sequelize, DataTypes) {
    var List = sequelize.define('List', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING,
            allowNull: false
        },
        emails_number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        is_enable: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        }
    }, {
        tableName: 'list'
    },{
    classMethods: {
      associate: function(models) {
        // Using additional options like CASCADE etc for demonstration
        // Can also simply do Task.belongsTo(models.User);
        
          List.belongsToMany(models.Email, {
            through: 'EmailList'            
          });

          List.belongsToMany(models.Campaign, {
            through: 'CampaignList'
          });
       
      }
    }
  });
    return List;
};
