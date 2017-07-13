var models = require('../models');
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();

var crypto;
try {
  crypto = require('crypto');
} catch (err) {
  crypto = null;
}

/* GET list listing. */
router.get('/', function (req, res, next) {
    
   var queryEnable, objQuery;
   if(typeof req.query.enable !== 'undefined'){
        queryEnable =req.query.enable;
        objQuery = {where: {is_enable: queryEnable}};
   }

   if(objQuery!==null){
       
         models.List.findAll(objQuery).then(function (lists) {
       
        res.json({
            "success": true,
            "message": "Listas encontradas",
            "data": lists
        });
    });
   }else{
        
         models.List.findAll().then(function (lists) {
           
            res.json({
                "success": true,
                "message": "Listas encontradas",
                "data": lists
            });
        });

   }
   
});

function randomValueBase64 (len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

router.post('/create', function (req, res) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var value, userInit, userValue;
    if(token){
            jwt.verify(token, 'clavetokenclienteservidor', function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
              } else {
                // if everything is good, save to request for use in other routes
                userValue = decoded.value;
                
                models.User.findOne({
                    where: {token: userValue},
                })
                .then(function(user){
                    if(user!==null){
                        return user;
                    }else{
                        throw new Error('No existe el usuario');
                    }
                }).then(function(user){
                    if(crypto!=null){
                        value = randomValueBase64(12);
                    }else{
                        value = '';
                    }
                    console.log(req.body.name);
                    return models.List.create({
                        name: req.body.name,
                        value: value,
                        emails_number: 0,
                        is_enable: req.body.enable,
                        id_user: user.id,
                       
                    }).then(function (list) {       
                        return list;
                    }).catch(function(err){
                        console.log(err);
                    });


                }).then(function(list){

                    if(list){
                        res.json({
                            "success": true,
                            "message": "Lista registrada correctamente.",
                            "data": req.body.email
                        });
                    }else{
                        throw new Error('No se pudo crear la lista')
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    res.json({
                        "success": false,
                        "message": err,
                        "data": null
                    });
                });
              }
            });
            
    }else{
         return res.status(403).send({ 
            success: false, 
            message: 'Token is invalid.',
            data: null, 
        });
    }
    
    
    
});


router.post('/:value/enable', function (req, res, next) {

    var valueList = req.params.value;
    var newValue = req.body.state;
    var mensaje;

    models.List.findOne({
        where: {
            value: valueList,
        }
    })
    .then(function(list){

        if(list!==null) {

            if(newValue==true ){
               
                mensaje = 'List was activated successfullly!';
            }else{

                 mensaje = 'List was deactivated successfullly!';
            }

            list.is_enable = newValue;
            return list.save().then(function(success){
                return list;
            });

           
        }else{
            throw new Error('hubo un error');
        }

    }).then(function(list){
        models.List.findAll().then(function(listas){

             return res.json({
                success: true,
                message: mensaje,
                data: listas,
            });
        })
        
    })
    .catch(function(err){
        return res.json({
            "success": false,
            "message": err,
            "data": null,
        });
    });


});



module.exports = router;
