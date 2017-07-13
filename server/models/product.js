/* jshint indent: 2 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  var Product = sequelize.define('Product', {
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
            value: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            path: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
  }, {
    tableName: 'product'
  },{
    classMethods: {
      associate: function(models) {
          Product.belongsToMany(models.Campaign, {
            through: 'CampaignProduct'
          });       
          
          Product.belongsTo(models.User, {foreignKey: 'id_user', targetKey: 'id'});  
      }

    
    }
  });
  
  return Product;
};
