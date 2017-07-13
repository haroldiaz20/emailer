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

router.get('/code', function(req, res, next){
   var tokenOpen = jwt.sign({
      campaignValue: 'Iz0Sb65s6gLg',
      emailMd5: 'c1f406497c5035fb693771d5958b0b33',
      sentAt: new Date().toISOString(),
  }, 'clavetokenclienteservidor');

  var urlOpen = globals.servidor.protocolo + '://' + globals.servidor.ip + ':' + globals.servidor.port + '/open?token=' + tokenOpen + '&email=' + 'a87c9d3ef78c3b9107893d3987b0d446';

  return res.json({
    token: urlOpen,
  });
});

/* GET auth. */
router.get('/', function(req, res, next){
    var io = req.app.get('socketio');

    
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

     var opened, emailMd5, campaignValue, emailInit, campaignInit, ip, linkClick, count, isMobile, isTablet, isDesktop, source, opSystem, platform, browser, sentAt;
     var fileName = 'open_img.png';
     ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;

     // Is mobile
     isMobile = req.useragent.isMobile;
     isTablet = req.useragent.isTablet || req.useragent.isIpad;
     isDesktop = req.useragent.isDesktop;
     linkClick = req.protocol + '://' + req.get('host') + req.originalUrl;
     count = 1;
     source = req.useragent.source;
     opSystem = req.useragent.os;
     platform =req.useragent.platform;
     browser = req.useragent.browser;


    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, 'clavetokenclienteservidor', function(err, decoded) {      
          if (err) {
            //return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            //return res.json({ success: true, message: 'Token is valid.' });

              emailMd5 = req.query.email;
              campaignValue = decoded.campaignValue;
              sentAt = decoded.sentAt;
              opened = new Date().toISOString();

              console.log('this email was sent at');
              console.log(sentAt);
              
              console.log('this email was opened at');
              console.log(opened);


              models.Email.findOne({where: {md5: emailMd5}})
              .then(function(email){
                if(email) return email;

                throw new Error('no existe el email');
              }).then(function(email){
                  emailInit = email;
                  return models.Campaign.findOne({
                    where: {value: campaignValue}
                  }).then(function(campaign){ 
                      if(campaignValue) return campaign;

                      throw new Error('no existe la campaign');
                  });
              }).then(function(campaign){
                campaignInit = campaign;

                return models.EmailOpen.findOne({where: {
                  id_campaign: campaignInit.id,
                  id_email: emailInit.id,
                }}).then(function(emailopen){
                    if(emailopen!==null){
                      var newCount = emailopen.count + 1;
                      emailopen.count =  newCount;
                      emailopen.opened_on = opened;
                      emailopen.save().then(function(res){
                          return emailopen;
                      });
                      
                    }else{
                        return models.EmailOpen.create({
                          opened_on: opened,
                          ip: ip,
                          link: linkClick,
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
                        }).then(function(emailopen){
                            if (emailopen!== null) {
                              return emailopen; 
                            }else{
                              throw new Error('no se pudo guardar en email open');  
                            }

                            
                        });
                    }
                   
                });

              }).then(function(emailopen){
                  if(emailopen!== null){
                      fileName = 'open_img.png';
                      

                      // enviamos la info a traves del socket
                      models.sequelize
                      .query('select c.name, c.status, c.description, c.value, c.friendly_from, c.subject, c."createdAt", (select coalesce(count(eo.id_email),0) from email_open eo where eo.id_campaign=c.id) as opens, (select coalesce(count(ec.id_email),0) from email_click ec where ec.id_campaign=c.id) as clicks from campaign c', {
                                  type: models.sequelize.QueryTypes.SELECT
                      })
                      .then(function(campaigns) {
                          io.emit('message-new-open', campaigns);
                      });

                      enviarOpenImage(fileName, req, res);
                  }else{
                    throw new Error('no se pudo guardar el open');
                  }
              })
              .catch(function(err){
                  console.log(err);
                  fileName = 'open_img.png';
                  enviarOpenImage(fileName, req, res);
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



function enviarOpenImage(fileName, req, res){

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
