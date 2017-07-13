
'use strict';

module.exports = function(sequelize, DataTypes) {
  var EmailOpen = sequelize.define('EmailOpen', { 
    opened_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    ip: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    count:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_mobile:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    is_tablet:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    is_desktop:{
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    source:{
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    os:{
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    platform:{
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    browser:{
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    sent_at: {
         type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    }
    
  }, 
  {
    tableName: 'email_open'
  });
  
  return EmailOpen;
};
