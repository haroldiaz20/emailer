/* jshint indent: 2 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  var CampaignProduct = sequelize.define('CampaignProduct', {   
    state: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "0"
    },
    link_click: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "",
    }
  }, {
    tableName: 'campaign_product'
  },{
    classMethods: {
      associate: function(models) {
          CampaignProduct.belongsToMany(models.Emails, {
            through: 'EmailClick'
          });
          
         
       
      }
    }
  });
  
  return CampaignProduct;
};
