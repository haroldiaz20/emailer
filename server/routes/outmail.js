var models = require('../models');

var express = require('express');
var router = express.Router();

/* GET outmail listing. */
router.get('/', function (req, res, next) {
    console.log('hola ususarios');
    models.Outmail.findOne().then(function (outmails) {  
        
        res.json({
            "success": true,
            "message": "outmails encontrados",
            "data": outmails
        });
    });

});

router.post('/create', function (req, res, next) {
    models.Outmail.findOne().then(function (outmail) {  
        var mensaje = '';
        if(!outmail){
            models.Outmail.create({
                host: req.body.host,
                port: req.body.port,
                password: req.body.password,
                is_secure: req.body.tls,
                username: req.body.username,
                
            }).then(function(){
                mensaje = 'Outmail created successfully!';
                res.json({
                    "success": true,
                    "message": mensaje,
                    "data": outmail
                });
            });
                       
           
        }else{
            outmail.host = req.body.host;
            outmail.port = req.body.port;
            outmail.password = req.body.password;
            outmail.is_secure = req.body.tls;
            outmail.username = req.body.username;
            outmail.save();
            mensaje = 'Outmail updated successfully!';
            res.json({
                "success": true,
                "message": mensaje,
                "data": outmail
            });
        }
      
        
    }).catch(function (err) {
        res.json({
            "success": false,
            "message": err,
            "data": null
        });
    });

    
    
});


module.exports = router;
