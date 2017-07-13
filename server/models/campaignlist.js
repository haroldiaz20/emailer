/* jshint indent: 2 */
'use strict';

module.exports = function(sequelize, DataTypes) {
  var CampaignList = sequelize.define('CampaignList', {   
    state: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: "0"
    }
  }, {
    tableName: 'campaign_list'
  });
  
  return CampaignList;
};
