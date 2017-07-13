var models = require('../models');
var path = require('path');
var session = require('express-session');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var globals = require('../bin/globals');

var crypto;
var sess;

try {
  crypto = require('crypto');
} catch (err) {
  crypto = null;
}



/* GET click. */
router.get('/', function(req, res, next){
    var io = req.app.get('socketio');

    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var imageName = 'not-found.jpeg';

/*   var token = jwt.sign({ campaignValue: '1n6TYw3009VK', emailMd5: 'a87c9d3ef78c3b9107893d3987b0d446'}, 'clavetokenclienteservidor');
   return res.json({
                    "success": true,
                    "message": "Welcome!!",
                    "data": {token: token},
              }).send();
    return;
    */
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, 'clavetokenclienteservidor', function(err, decoded) {      
          if (err) {
            //return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            //return res.json({ success: true, message: 'Token is valid.' });  


            // obtenemos el producto
            var productValue = decoded.productValue;

            var campaignValue = decoded.campaignValue;

            var clicked, campaignInit, emailInit, productInit, ipInit, fullUrlInit, count, isMobile, isTablet, isDesktop, source, opSystem, platform, browser, sentAt;
            ipInit = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||req.connection.socket.remoteAddress;

            fullUrlInit = req.protocol + '://' + req.get('host') + req.originalUrl;
            isMobile = req.useragent.isMobile;
             isTablet = req.useragent.isTablet || req.useragent.isIpad;
             isDesktop = req.useragent.isDesktop;
             linkClick = req.protocol + '://' + req.get('host') + req.originalUrl;
             count = 1;
             source = req.useragent.source;
             opSystem = req.useragent.os;
             platform =req.useragent.platform;
             browser = req.useragent.browser;
             sentAt = decoded.sentAt;
             clicked = new Date().toISOString();

            models.Product.findOne({where: {value: productValue}})
            .then(function(producto){
               if(producto!==null){
                  productInit = producto;
                  imageName = producto.path;
                  

                  var emailMd5;

                  if(req.query.email){
                      emailMd5 = req.query.email;
                  }


                  return models.Email.findOne({where: {md5: emailMd5}})
                  .then(function(email){
                      if(email) {
                        emailInit = email;
                        return email
                      }else{
                       throw new Error('no existe el email');
                      }
                  });
                  
               }else{
                 throw new Error('no existe este producto');
               }
            }).then(function(email){
                var camp = decoded.campaignValue;
                return models.Campaign
                  .findOne({where: {value: camp}})
                  .then(function(campaign){
                        if(campaign) {
                          campaignInit = campaign;
                          return campaign
                        }else{
                           throw new Error('no existe esta campaign');
                        }
                  });               
           

             }).then(function(campaign){


                return models.EmailClick.findOne({where: {
                  id_campaign: campaignInit.id,
                  id_email: emailInit.id,
                  id_product: productInit.id,
                }}).then(function(emailclick){
                    if(emailclick!==null){
                      var newCount = emailclick.count + 1;
                      emailclick.count =  newCount;
                      clicked_on: clicked,
                      emailclick.save().then(function(res){
                          return emailclick;
                      });
                      
                    }else{
                        return models.EmailClick.create({
                          clicked_on: clicked,
                          ip: ipInit,
                          link: fullUrlInit,
                          count: 1,
                          is_mobile: isMobile,
                          is_tablet: isTablet,
                          is_desktop: isDesktop,
                          source: source,
                          os: opSystem,
                          platform: platform,
                          browser: browser,
                          sent_at: sentAt,
                          id_campaign: campaignInit.id,
                          id_email: emailInit.id,
                          id_product: productInit.id,
                        }).then(function(emailclick){
                            if (emailclick!==null)
                             {
                               return emailclick;
                             } else{
                                throw new Error('no se pudo guardar en email click');
                             }

                            
                        });
                    }
                    
                });
                 

            }).then(function(emailclick){
                if(emailclick!== null){
                      fileName = productInit.path;

                      // enviamos la info a traves del socket
                      models.sequelize
                      .query('select c.name, c.status, c.description, c.value, c.friendly_from, c.subject, c."createdAt", (select coalesce(count(eo.id_email),0) from email_open eo where eo.id_campaign=c.id) as opens, (select coalesce(count(ec.id_email),0) from email_click ec where ec.id_campaign=c.id) as clicks from campaign c', {
                                  type: models.sequelize.QueryTypes.SELECT
                      })
                      .then(function(campaigns) {
                          io.emit('message-new-click', campaigns);
                      });

                      returnImageClick(fileName, req, res);
                  }else{
                    throw new Error('no se pudo guardar el click');
                  }
            }).catch(function(err){
                console.log(err);
              
                imageName = 'not-found.jpeg';
             
                returnImageClick(imageName, req, res);

            });


          }
        });


      } else {

        // if there is no token
        // return an error
        return res.status(403).send({ 
            success: false, 
            message: 'No token provided.' 
        });
        
      }




});


function returnImageClick(imageName, req, res){

      // Send image
      var fileName = imageName;
   
      var options = {
        root: __dirname + '/../public/images',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
      };

      
      res.sendFile(fileName, options, function (err) {
        if (err) {
          next(err);
        } else {
          console.log('Sent:', fileName);
        }
      });


}

module.exports = router;
