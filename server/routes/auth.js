var models = require('../models');
var session = require('express-session');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var crypto;
var sess;

try {
    crypto = require('crypto');
} catch (err) {
    crypto = null;
}



/* GET auth. */
router.get('/', function (req, res, next) {
    sess = req.session;
    console.log('verificar sesion');
    console.log('*******************');
    console.log(sess);
    console.log('*******************');
    var success;
    var email = '';
    if (req.session.usuario) {
        console.log(req.session.usuario.email);
        console.log(req.session.usuario.created);
        success = true;
        email = req.session.usuario.email;
    } else {

        success = false;
    }

    return res
            .json({
                "success": success,
                "message": "usuarios encontrados",
                "data": {email: email},
            })
            .send();

});


router.post('/', function (req, res, next) {

    if (req.body.email === '' || req.body.email === null) {
        res.json({
            "success": false,
            "message": "Invalid email address",
            "data": {email: req.body.email},
        }).send();
    } else {


        models.User.findOne({
            where: {email: req.body.email},
        }).then(function (user) {
            if (user !== null) {

                // Verify Password
                var pass;
                if (req.body.password !== null) {
                    pass = req.body.password;
                    pass = crypto.createHash('md5').update(pass).digest("hex");
                }

                if (pass === user.password) {
                    var token = jwt.sign({email: user.email, value: user.token, fullName: user.first_name + ' ' + user.last_name}, 'clavetokenclienteservidor');
                    res.json({
                        "success": true,
                        "message": "Welcome!!",
                        "data": {full_name: user.first_name + ' ' + user.last_name, email: user.email, token: token},
                    }).send();
                } else {

                    res.json({
                        "success": false,
                        "message": "Password incorrect!",
                        "data": null,
                    }).send();
                }


            } else {
                return res
                        .json({
                            "success": false,
                            "message": "This user does not exist.",
                            "data": null,
                        })
                        .send();
            }
        })
                .catch(function (err) {
                    console.log(err);
                });

    }





});

router.post('/verify', function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];


    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'clavetokenclienteservidor', function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                return res.json({
                    success: true,
                    message: 'Token is valid.',
                    data: {
                        full_name: decoded.fullName,
                        email: decoded.email,
                        token: token
                    }
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

module.exports = router;
