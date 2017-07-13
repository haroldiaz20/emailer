var models = require('../models');
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

var os = require('os');
var ifaces = os.networkInterfaces();
var fs = require('fs');
var utils = require('../utils');


/* GET campaigns. */
router.get('/', function (req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    var userValue;
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'clavetokenclienteservidor', function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.', data: null});
            } else {
                // let's get the user value from the token
                userValue = decoded.value;
                // Let's find a user from db
                models.User.findOne({where: {token: userValue}})
                        .then(function (user) {
                            if (user !== null) {
                                getCampaigns(user, res, req, next);
                            } else {
                                return res.json({
                                    "success": false,
                                    "message": 'No existe este usuario',
                                    "data": null
                                });
                            }
                        })
                        .catch(function (err) {
                            return res.json({
                                "success": false,
                                "message": err.message,
                                "data": null
                            });
                        });

            }
        });

    } else {
        return res.status(403).json({
            "success": false,
            "message": 'No tiene permisos para acceder a este recurso',
            "data": null
        });
    }


});

function getCampaigns(user, res, req, next) {


    if (user.type === 1) {
        models.sequelize
                .query('select c.name, c.status, c.description, c.value, c.friendly_from, c.subject, c."createdAt", (select coalesce(count(eo.id_email),0) from email_open eo where eo.id_campaign=c.id) as opens, (select coalesce(count(ec.id_email),0) from email_click ec where ec.id_campaign=c.id) as clicks from campaign c', {
                    type: models.sequelize.QueryTypes.SELECT
                })
                .then(function (campaigns) {
                    return res.json({
                        success: true,
                        message: 'Campaigns loaded for admin',
                        data: campaigns,
                    })
                }).catch(function (err) {
            return res.json({
                "success": false,
                "message": err.message,
                "data": null
            });
        });
    } else if (user.type === 2) {
        models.sequelize
                .query('select c.name, c.status, c.description, c.value, c.friendly_from, c.subject, c."createdAt", (select coalesce(count(eo.id_email),0) from email_open eo where eo.id_campaign=c.id) as opens, (select coalesce(count(ec.id_email),0) from email_click ec where ec.id_campaign=c.id) as clicks from campaign c where c.id_user=:idUser',
                        {
                            replacements: {
                                idUser: user.id
                            },
                            type: models.sequelize.QueryTypes.SELECT
                        })
                .then(function (campaigns) {
                    res.json({
                        success: true,
                        message: 'Campaigns loaded for this user: ' + user.email,
                        data: campaigns,
                    }).send();
                }).catch(function (err) {
            res.json({
                "success": false,
                "message": err.message,
                "data": null,
            }).send();
        });
    } else {
        return res.json({
            "success": false,
            "message": 'Hubo un error autenticando a este usuario',
            "data": null,
        });
    }
}



router.get('/:value/emails', function (req, res, next) {
    var campaignValue = req.params.value;

    models.sequelize
            .query('select e.email, e.country, e.sexo, l.name, l.value,el.state from email_list el left join email e on el.id_email = e.id left join list l on el.id_list = l.id where el.id_list in (select cl.id_list from campaign_list cl inner join campaign c on cl.id_campaign = c.id where c.value=:campaignVal) order by l.name', {
                replacements: {
                    campaignVal: campaignValue
                },
                type: models.sequelize.QueryTypes.SELECT
            })
            .then(function (emails) {
                return res.json({
                    success: true,
                    message: 'Emails loaded',
                    data: emails,
                })
            });
});


router.get('/:value/opens', function (req, res, next) {
    var campaignValue = req.params.value;

    models.sequelize
            .query('select eo.browser, eo.ip, eo.opened_on, eo.platform, eo.sent_at, eo.count, eo.os, e.email, e.sexo, e.country, e.age from email_open eo inner join email e on eo.id_email = e.id inner join campaign c on eo.id_campaign = c.id where c.value=:idCampaign', {
                replacements: {
                    idCampaign: campaignValue
                },
                type: models.sequelize.QueryTypes.SELECT
            })
            .then(function (emails) {
                return res.json({
                    success: true,
                    message: 'These are the opens for this campaign.',
                    data: emails,
                })
            });
});

router.get('/:value/lists', function (req, res, next) {
    var campaignValue = req.params.value;

    models.sequelize
            .query('select l.value, l.name, l.emails_number, l.is_enable, l."createdAt" from list l where l.id IN (select cl.id_list from campaign_list cl left join campaign c on cl.id_campaign=c.id where c.value=:idCampaign);', {
                replacements: {
                    idCampaign: campaignValue
                },
                type: models.sequelize.QueryTypes.SELECT
            })
            .then(function (lists) {
                return res.json({
                    success: true,
                    message: 'These are the lists for this campaign.',
                    data: lists,
                })
            });
});


router.get('/:value/products', function (req, res, next) {
    var campaignValue = req.params.value;

    models.sequelize
            .query('select p.value, p.name, p.description, p.path, p."createdAt" from product p where p.id IN (select cp.id_product from campaign_product cp left join campaign c on cp.id_campaign=c.id where c.value=:val);', {
                replacements: {
                    val: campaignValue
                },
                type: models.sequelize.QueryTypes.SELECT
            })
            .then(function (products) {
                return res.json({
                    success: true,
                    message: 'These are the products for this campaign.',
                    data: products,
                })
            });
});

router.get('/:value/clicks', function (req, res, next) {
    var campaignValue = req.params.value;

    models.sequelize
            .query('select ec.browser, ec.ip, ec.clicked_on,ec.platform, ec.sent_at, ec.count, ec.os, e.email, e.sexo, e.country, e.age, p.name as product_name from email_click ec inner join email e on ec.id_email = e.id inner join campaign c on ec.id_campaign = c.id left join product p on ec.id_product = p.id where c.value=:idCampaign', {
                replacements: {
                    idCampaign: campaignValue
                },
                type: models.sequelize.QueryTypes.SELECT
            })
            .then(function (emails) {
                return res.json({
                    success: true,
                    message: 'These are the clicks for this campaign.',
                    data: emails,
                })
            });


});

router.post('/open', function (req, res, next) {

    var opened = new Date().toISOString();
    var sentAt = new Date().toISOString();

    console.log(opened);
    console.log("-------------");
    console.log(sentAt);

    setTimeout(function () {
        models.EmailOpen.create({
            opened_on: new Date().toISOString(),
            ip: '',
            link: '',
            count: 1,
            is_mobile: false,
            is_tablet: false,
            is_desktop: true,
            source: '',
            os: '',
            platform: '',
            browser: '',
            sent_at: sentAt,
            id_campaign: 3,
            id_email: 1,
        }).then(function (emailopen) {
            console.log('creadoooo');
            console.log(emailopen);
        }).catch(function (err) {
            console.log(err);
        });
    }, 5000);



});


router.post('/create', function (req, res, next) {
    // Verify the token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var userValue;
    if (token) {

        jwt.verify(token, 'clavetokenclienteservidor', function (err, decoded) {
            if (err) {
                res.status(403).json({
                    "success": false,
                    "message": 'Failed to authenticate token.',
                    "data": null
                }).send();
            } else {
                // FISRT: let's upload & save each image that's been sent by the user
                console.log('you are here');
                console.log(req);

                // SECOND: let's replace each image selected by ID {{img_}} and add a link {{link_}}


                // THIRD: let's replace each text from the template selected by ID

                res.status(200).json({
                    "success": true,
                    "message": 'Credenciles correctas.',
                    "data": null
                }).send();
            }
        });

    } else {
        res.status(403).json({
            "success": false,
            "message": "No tiene permisos para ver este recurso.",
            "data": null}
        ).send();
    }

});

router.post('/', function (req, res, next) {

    // Verify token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    var userValue;
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'clavetokenclienteservidor', function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.', data: null});
            } else {
                // if everything is good, save to request for use in other routes
                //return res.json({ success: true, message: 'Token is valid.' });    
                userValue = decoded.value;
                var name = req.body.name;
                var subject = req.body.subject;
                var value;
                if (crypto !== null) {
                    value = utils.randomValueBase64(12);
                } else {
                    value = '';
                }
                var friendly = req.body.friendly;
                var description = req.body.description;
                var body = req.body.body;
                var linkClick = '';
                var linkOpen = '';
                var linkUnsub = '';

                var listas;


                var userInit, campaignInit, productInit;
                // verificamos las listas y productos
                var listasReq = req.body.lists;
                if (listasReq.length <= 0) {
                    return res.json({
                        "success": false,
                        "message": 'No ha escogido una lista para esta campaña',
                        "data": null,
                    });
                }

                var productsReq = req.body.products;
                if (productsReq.length <= 0) {
                    return res.json({
                        "success": false,
                        "message": 'No ha escogido algún producto para esta campaña',
                        "data": null,
                    });
                }


                models.User.findOne({
                    where: {token: userValue}
                }).then(function (user) {
                    if (user)
                        return user;
                    throw new Error('no existe este usuario o su token es inválido');

                }).then(function (user) {
                    userInit = user;

                    // Create the campaign
                    return models.Campaign.create({
                        name: name,
                        value: value,
                        description: description,
                        subject: subject,
                        friendly_from: friendly,
                        body_html: body,
                        link_click: linkClick,
                        link_unsubscribe: linkUnsub,
                        link_open: linkOpen,
                        id_user: user.id,
                        delivered: 0,
                        undelivered: 0,
                        datetime_start: null,
                        datetime_end: null,
                    })
                            .then(function (campaign) {
                                return campaign;
                            });

                }).then(function (campaign) {
                    campaignInit = campaign;

                    // Loop through the products array
                    var products = req.body.products;

                    return models.Product
                            .findAll({
                                where: {value: products}

                            }).then(function (productos) {

                        productos.forEach(function (producto) {
                            var linkClickProduct = '';
                            linkClickProduct = jwt.sign({productValue: producto.value, campaignValue: campaignInit.value}, 'clavetokenclienteservidor');

                            models.CampaignProduct.create({
                                link_click: linkClickProduct,
                                state: 0,
                                id_campaign: campaignInit.id,
                                id_product: producto.id,
                            });
                        });

                        return productos;
                    });

                }).then(function (productos) {

                    var lists = req.body.lists;
                    return models.List
                            .findAll({
                                where: {value: lists}

                            }).then(function (listas) {
                        listas.forEach(function (lista) {

                            models.CampaignList.create({
                                state: 0,
                                id_campaign: campaignInit.id,
                                id_list: lista.id,
                            });
                        });

                        return listas;
                    });

                }).then(function (listas) {
                    if (listas) {
                        res.json({
                            "success": true,
                            "message": 'campaign created',
                            "data": campaignInit.value,
                        });
                    }

                }).catch(function (err) {
                    console.log(err);
                    res.json({
                        "success": false,
                        "message": 'there was an error',
                        "data": null,
                    });

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



router.post('/create-campaign', function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var userValue;
    if (token) {
        jwt.verify(token, 'clavetokenclienteservidor', function (err, decoded) {
            if (err) {
                res.status(403).json({
                    "success": false,
                    "message": 'Failed to authenticate token.',
                    "data": null
                }).send();
            } else {
                userValue = decoded.value;
                // Let's find the user
                models.User
                        .findOne({where: {token: userValue}})
                        .then(function (user) {
                            if (user == null) {
                                return next(new Error(`This user doesn't exist`));
                            } else {
                                return user;
                            }
                        })
                        .then(function (user) {
                            // Receive params sent by the client
                            const value = utils.randomValueBase64(12);
                            const body = req.body.body;

                            const listas = req.body.lists;
                            const productos = req.body.images;
                            var friendlyFrom = null;
                            if (typeof req.body.friendly == 'undefined' || req.body.friendly == null) {
                                var err = new Error(`You haven't insert a Fiendly From for this campaign`);
                                return next(err);
                            } else {
                                friendlyFrom = req.body.friendly;
                            }

                            const subject = (typeof req.body.subject != 'undefined' && req.body.subject != null) ? req.body.subject : value;
                            const name = (typeof req.body.name != 'undefined') ? req.body.name : value;
                            const description = (typeof req.body.desc != 'undefined') ? req.body.desc : '';
                            const linkClick = '';
                            const linkUnsub = '';
                            const linkOpen = '';

                            var fileHtmlPath = __dirname + '/../views/templates/email.html';

                            var newBody = '';
                            var campaignInit = 0;
                            // Read the file that contains the HTML friendly for our template to be wrapped 
                            fs.readFile(fileHtmlPath, 'utf8', (err, data) => {
                                if (err)
                                    return next(err);
                                // Once we have de data from the file, we must replace the content of it
                                newBody = utils.reeplaceHtmlBody(data, '{{__CONTENT__}}', body);
                                // Replace images and add links to each image in this template
                                newBody = utils.reeplaceImagesAndAddLinkTracking(newBody, productos);
                                // Add a OPEN VARIABLE
                                newBody = utils.addOpenVariable(newBody);
                                // Now let's procede to save the campaign
                                models.Campaign.create({
                                    name: name,
                                    value: value,
                                    description: description,
                                    subject: subject,
                                    friendly_from: friendlyFrom,
                                    body_html: newBody,
                                    link_click: linkClick,
                                    link_unsubscribe: linkUnsub,
                                    link_open: linkOpen,
                                    id_user: user.id,
                                    delivered: 0,
                                    undelivered: 0,
                                    datetime_start: null,
                                    datetime_end: null,
                                }).then(function (campaign) {
                                    campaignInit = campaign;
                                    console.log(listas);
                                    // Let's save each list for this campaign to be sent
                                    var newListas = listas.map(function (obj) {
                                        return obj.value;
                                    });
                                    console.log('nueva lista');
                                    console.log(newListas);

                                    return models.List.findAll({
                                        where: {value: newListas}

                                    }).then(function (listsArray) {

                                        listsArray.forEach(function (lista) {

                                            models.CampaignList.create({
                                                state: 0,
                                                id_campaign: campaign.id,
                                                id_list: lista.id,
                                            });
                                        });

                                        return listsArray;
                                    });


                                }).then(function (lists) {
                                    // Let's save each product uploaded by the user
                                    return models.Product
                                            .findAll({
                                                where: {value: productos}
                                            }).then(function (products) {

                                        products.forEach(function (producto) {
                                            var linkClickProduct = '';
                                            linkClickProduct = jwt.sign({productValue: producto.value, campaignValue: campaignInit.value}, 'clavetokenclienteservidor');

                                            models.CampaignProduct.create({
                                                link_click: linkClickProduct,
                                                state: 0,
                                                id_campaign: campaignInit.id,
                                                id_product: producto.id,
                                            });
                                        });

                                        return products;
                                    });
                                }).then(function (products) {
                                    res.json({"success": true, "data": campaignInit, "message": 'Campaign created successfully!!'}).send();
                                }).catch(function (err) {
                                    return next(err);
                                });

                            });
                        })
                        .catch(function (err) {
                            return next(err);
                        });

            }
        });

    } else {
        res.status(403).json({
            "success": false,
            "message": `You haven't provide a valid token.`,
            "data": null
        }).send();
    }





});




module.exports = router;
