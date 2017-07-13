'use strict';

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
if (process.env.DATABASE_URL) {
  var sequelize = new Sequelize(process.env.DATABASE_URL,config);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}
var db        = {};

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

db.Sequelize = Sequelize;


//Models/tables
//db.Campaign = require('./campaign.js')(sequelize, Sequelize);  
db.User = require('./user')(sequelize, Sequelize);  
db.List = require('./list')(sequelize, Sequelize);  
db.Email = require('./email')(sequelize, Sequelize);
db.EmailList = require('./emaillist')(sequelize, Sequelize);
db.CampaignList = require('./campaignlist')(sequelize, Sequelize);
db.CampaignProduct = require('./campaignproduct')(sequelize, Sequelize);
db.EmailClick = require('./emailclick')(sequelize, Sequelize);
db.EmailOpen = require('./emailopen')(sequelize, Sequelize);
//Relations
//db.Campaign.belongsTo(db.posts);  
//db.List.hasMany(db.comments);  

db.User.hasMany(db.Campaign, {
  foreignKey: {
    name: 'id_user',
    allowNull: false
  }
});

db.User.hasMany(db.List, {
  foreignKey: {
    name: 'id_user',
    allowNull: false
  }
});

db.User.hasMany(db.Product, {
  foreignKey: {
    name: 'id_user',
    allowNull: false
  }
});

// just added
db.Product.belongsTo(db.User, {foreignKey: 'id_user', targetKey: 'id'});  


db.Email.belongsToMany(db.List, { through: db.EmailList, foreignKey: 'id_email', otherKey: 'id_list'});
db.List.belongsToMany(db.Email, { through: db.EmailList, foreignKey: 'id_list', otherKey: 'id_email'});

db.Campaign.belongsToMany(db.List, { through: db.CampaignList, foreignKey: 'id_campaign', otherKey: 'id_list'});
db.List.belongsToMany(db.Campaign, { through: db.CampaignList, foreignKey: 'id_list', otherKey: 'id_campaign'});

db.Campaign.belongsToMany(db.Product, { through: db.CampaignProduct, foreignKey: 'id_campaign', otherKey: 'id_product'});
db.Product.belongsToMany(db.Campaign, { through: db.CampaignProduct, foreignKey: 'id_product', otherKey: 'id_campaign'});


db.Campaign.belongsToMany(db.Email, { through: db.EmailOpen, foreignKey: 'id_campaign', otherKey: 'id_email'});
db.Email.belongsToMany(db.Campaign, { through: db.EmailOpen, foreignKey: 'id_email', otherKey: 'id_campaign'});
/*
db.Product.belongsToMany(db.Email, { through: db.EmailClick, foreignKey: 'id_product', otherKey: 'id_email'});
db.Product.belongsToMany(db.Campaign, { through: db.EmailClick, foreignKey: 'id_product', otherKey: 'id_campaign'});

db.Email.belongsToMany(db.Product, { through: db.EmailClick, foreignKey: 'id_email', otherKey: 'id_product'});
db.Email.belongsToMany(db.Campaign, { through: db.EmailClick, foreignKey: 'id_email', otherKey: 'id_campaign'});*/



module.exports = db;