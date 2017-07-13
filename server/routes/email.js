var models = require('../models');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var utils = require('../utils');

var crypto;
try {
  crypto = require('crypto');
} catch (err) {
  crypto = null;
}



/* GET users listing. */
router.get('/', function (req, res, next) {

   
    models.Email.findAll()
    .then(function (emails) {
        if(emails.length <= 0) throw new Error('no hay correos');
        
        res.json({
            "success": true,
            "message": "usuarios encontrados",
            "data": emails
        });
    }).catch(function(err){
        res.json({
            "success": false,
            "message": err.message,
            "data": null
        });
    });

});


/* GET a single email */
router.get('/:md5', function (req, res, next) {
    
    var md5Email; 
    if(req.params.md5){
        md5Email = req.params.md5;
    }


    models.Email.findOne({
        where: {md5: md5Email},
        include: [{
            model: models.List,
        }]
    })
    .then(function (email) {
        if(email!==null){
            if(email.state == 2){
                return res.status(403).send("Sorry! This email has been deleted.");
            }
            return res.json({
                "success": true,
                "message": "usuarios encontrados",
                "data": email
            });
        } else{
            throw new Error('This email account doens\'t exists');
        }
            

    }).catch(function(err){
        res.json({
            "success": false,
            "message": err.message,
            "data": null
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


/* POST Create Email */
router.post('/create', function (req, res) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];


    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'clavetokenclienteservidor', function(err, decoded) {      
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
            } else {
                
                saveEmailAndList(req, res, decoded);
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


router.get('/:md5/list/:value', function (req, res, next) {

    var md5Email = req.params.md5;
    var valueLista = req.params.value;

    models.Email.findOne({
        where: {
            md5: md5Email,
        }, include: [{
        model: models.List,
        where: { value: valueLista }
    }],
    })
    .then(function(email){

        if(email!==null) {
              return res.json({
            "email": email,
        });
        }else{
            throw new Error('hubo un error');
        }

    }).catch(function(err){
        return res.json({
            "message": err,
        });
    });


});

function saveEmailAndList(req, res, decoded){

    var pais = req.body.country.toUpperCase();
    var edad = parseInt(req.body.age, 10);
    var correo = req.body.email;
    var sexo = req.body.sex;
    var md5 = correo;
    if(crypto!=null){
        md5 = crypto.createHash('md5').update(md5).digest("hex");
    }

    models.Email.findOne({
        where: {email: req.body.email}
    })
    .then(function(email){
        if(email!==null) {
            email.email = correo;
            email.country = pais;
            email.age = edad;
            email.sexo = sexo;
            email.md5 = md5;
            return email.save().then(function(){
                return email;
            });
        }else{
            return models.Email.create({
                email: correo,
                state: 1,
                country: pais,
                age: edad,
                md5: md5,
                sexo: sexo,
            }).then(function(email){
                return email;
            });
        }      
       
    })
    .then(function(email){

        var lists = req.body.lists;

        models.List

        lists.forEach( function (list){
            models.List.findOne({where: {id: list.id}})
            .then(function(lista){

                models.EmailList.findOne({where: {
                    id_email: email.id,
                    id_list: lista.id,
                }})
                .then(function(emaillist){
                    if(emaillist!==null){
                        return emaillist;
                    }else{
                        return models.EmailList.create({                    
                            id_email: email.id,
                            id_list: lista.id,     
                            state: 1,      
                        }).then(function(emaillista){
                                
                                return emaillista;
                        });
                    }
                }).then(function(emailLista){
                        // Save or update emaillist state
                        var stateEmailList;
                        var countEmails;

                        if(list.state == true){
                            countEmails = lista.emails_number + 1;
                            stateEmailList = 1;
                           
                        }else{
                            countEmails = lista.emails_number - 1;
                            stateEmailList = 0;
                        }
                        emailLista.state = stateEmailList;
                        emailLista.save();

                        
                        lista.emails_number = countEmails;
                        lista.save();
                });
            })
            .catch(function(err){
                console.log(err);
            });

            
            
        });

       
        
        return lists;
           
    })
    .then(function(listas){
        res.json({
            "success": true,
            "message": "Email y lista registrados correctamente.",
            "data": listas
        });
    })
    .catch(function(err){
        console.log(err);
        res.json({
            "success": false,
            "message": err.message,
            "data": null
        });
    });
    

}



router.delete('/:md5', function (req, res, next) {

    var md5Email = req.params.md5;
  

    models.Email.findOne({
        where: {
            md5: md5Email,
        }
    })
    .then(function(email){

        if(email!==null) {
            email.state = 2;
            return email.save().then(function(success){
                return email;
            });

           
        }else{
            throw new Error('hubo un error');
        }

    }).then(function(email){
        models.Email.findAll().then(function(emails){
             return res.json({
                success: true,
                message: 'Email was deleted successfullly!',
                data: emails,
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




router.post('/:md5/activate', function (req, res, next) {

    var md5Email = req.params.md5;
  

    models.Email.findOne({
        where: {
            md5: md5Email,
        }
    })
    .then(function(email){

        if(email!==null) {
            email.state = 1;
            return email.save().then(function(success){
                return email;
            });

           
        }else{
            throw new Error('hubo un error');
        }

    }).then(function(email){
        models.Email.findAll().then(function(emails){
             return res.json({
                success: true,
                message: 'Email was activated successfullly!',
                data: emails,
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


router.post('/test', function (req, res, next){
        const host = req.body.host;
        const port = req.body.port;
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const message = req.body.message;
        
        var isSecure = false;
        if(req.body.isSecure == 1 || req.body.isSecure == true){
            isSecure = true;
        }else{
            isSecure = false;
        }

            
        utils.sendEmail(host, port, isSecure, username, password, true, message, email).then(function(result){
            console.log("Este es el resultado: " + result);
            if(result > -1){
                console.log('Se enviaron: ' + result + ' campañas');
                return res.json({
                    sucess: true,
                    message: 'Se envió correctamente el mensaje de prueba.',
                })
            }else{

                return res.json({
                    success: false,
                    message: 'Hubo un error tratando de enviar el mensaje de prueba.',
                });
            }
        });
});



module.exports = router;
