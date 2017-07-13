var models = require('../models');
var express = require('express');
var router = express.Router();

var crypto;
try {
  crypto = require('crypto');
} catch (err) {
  crypto = null;
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    console.log('hola ususarios');
    models.User.findAll().then(function (users) {

        res.json({
            "success": true,
            "message": "usuarios encontrados",
            "data": users
        });
    });

});

function randomValueBase64 (len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

router.post('/create', function (req, res) {

    var token;
    if(crypto!==null){
        token = randomValueBase64(12);
    }else{
        token = '';
    }
  
    var type = 1;
    if(req.body.type){
        type = req.body.type;
    }

    var pass;
    if(req.body.password!==null){
        pass = req.body.password;
        pass = crypto.createHash('md5').update(pass).digest("hex");
    }

    console.log(req.body.email);
    models.User.create({
        email: req.body.email,
        password: pass,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        image: '',
        address: '',       
        token: token,
        type: type,
    }).then(function () {       
        res.json({
            "success": true,
            "message": "Usuario creado exitosamente",
            "data": req.body.email
        });
    }).catch(function (err) {
        console.log(err);
        res.json({
            "success": false,
            "message": err,
            "data": null
        });
    });
});


// Actualizar usuario
router.put('/', function (req, res) {

    var token;
    if(crypto!==null){
        token = randomValueBase64(12);
    }else{
        token = '';
    }

    var pass;
    if(req.body.password!==null){
        pass = req.body.password;
        pass = crypto.createHash('md5').update(pass).digest("hex");
    }

    models.User.findOne({ where:{
        email: req.body.email,}
        }).then(function (user) { 
            user.password =  pass;
            user.first_name = req.body.first_name;
            user.last_name = req.body.last_name;
            user.phone = req.body.phone;
            user.image = '';
            user.address='';       
            user.token = token;
            user.type = 1;
            user.save();
      
        res.json({
            "success": true,
            "message": "Usuario actualizado correctamente",
            "data": req.body.email
        });
    }).catch(function (err) {
        console.log(err);
        res.json({
            "success": false,
            "message": err,
            "data": null
        });
    });
});


module.exports = router;
