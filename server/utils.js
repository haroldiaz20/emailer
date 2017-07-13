var nodemailer = require('nodemailer');
var models = require('./models');
var jwt = require('jsonwebtoken');
var globals = require('./bin/globals');

var crypto;
try {
    crypto = require('crypto');
} catch (err) {
    crypto = null;
}

module.exports = {
    addOpenVariable: function(bodyStr){
        var position = bodyStr.indexOf('</body>');
        var nuevoBody = [bodyStr.slice(0, position), '{{open}}', bodyStr.slice(position)].join('');
        
        return nuevoBody;
    },
    reeplaceImagesAndAddLinkTracking: function (htmlData, arrayValues) {
        var inicio = 0;
        var stringReplace, linkReplace, indexSrcValue, startImgValuePos, endImgValuePos, startSrcValuePos, endSrcValuePos;

        for (var i = 0; i < arrayValues.length; i++) {
            /**
             * Primero se reemplazan los SRC de imágenes y luego se agregan los links, porque al momento de buscar por el código de la imagen
             * va a encontrar primero el del link y entonces no va a reemplazar el SRC en donde debería ser
             */
            var nueva = '', finalStr = '';
            stringReplace = '{{img_' + arrayValues[i] + '}}';
            linkReplace = '{{link_' + arrayValues[i] + '}}';

            // Replace SRC of images

            // Find image value: src='value_name.png';
            indexSrcValue = htmlData.indexOf(arrayValues[i], inicio);
            // Inicio del attribute src=""
            startSrcValuePos = htmlData.lastIndexOf('"', indexSrcValue);
            // Final del attribute src=""
            endSrcValuePos = htmlData.indexOf('"', indexSrcValue);

            // Si no le sumamos 1 a endSrcValuePos, nos va a contar la comilla doble tbn ("), no queremos que cuente esa comilla
            nueva = [htmlData.slice(inicio, startSrcValuePos), stringReplace, htmlData.slice(endSrcValuePos + 1)].join('');


            // ADD link to images

            // Find image value: src='value_name.png';
            indexSrcValue = nueva.indexOf(arrayValues[i], inicio);
            // Inicio del tag <img />
            startImgValuePos = nueva.lastIndexOf('<img', indexSrcValue);
            // Final del tag <img />
            endImgValuePos = nueva.indexOf('>', indexSrcValue);

            finalStr = [nueva.slice(inicio, startImgValuePos), '<a target="_blank" href=' + linkReplace + '>', nueva.slice(startImgValuePos, endImgValuePos + 1), '</a>', nueva.slice(endImgValuePos + 1)].join('');

            // SET final htmlData
            htmlData = finalStr;


        }

        return htmlData;
    },
    reeplaceHtmlBody: function (htmlData, variable, newContent) {
        return htmlData.replace(variable, newContent);
    },
    randomValueBase64: function (len) {
        return crypto.randomBytes(Math.ceil(len * 3 / 4))
                .toString('base64') // convert to base64 format
                .slice(0, len) // return required number of characters
                .replace(/\+/g, '0') // replace '+' with '0'
                .replace(/\//g, '0'); // replace '/' with '0'
    },
    sendEmail: function (host, port, isSecure, username, password, isTest, messageTest, emailTest) {

        var poolConfig = {
            pool: true,
            host: host,
            port: port,
            secure: isSecure, // use TLS
            auth: {
                user: username,
                pass: password,
            },
            tls: {
                ciphers: 'SSLv3'
            }
        };

        var transporter = nodemailer.createTransport(poolConfig);


        var campaignsArray, campaignInit, emailInit, bodyText, bodyFinal, campaignInit2;

        return transporter.verify()
                .then(function (success) {
                    console.log('Server is ready to take our messages');
                    if (isTest == true) {
                        var mailOptions = {
                            from: '"Administrator" <' + username + '>', // sender address
                            to: emailTest, // list of receivers
                            subject: 'Test only', // Subject line
                            text: messageTest, // plain text body
                            html: '' // html body
                        };

                        // send mail with defined transport object
                        return transporter.sendMail(mailOptions)
                                .then(function (info) {
                                    console.log('Message %s sent: %s', info.messageId, info.response);
                                    return 1;
                                }).catch(function (error) {
                            console.log(error);
                            return -1;
                        });

                    } else {

                        // Let's get all campaigns hat haven't been sent 
                        return models.Campaign.findAll({
                            where: {
                                status: 0
                            }
                        })
                                .then(function (campaigns) {
                                    if (campaigns.length > 0) {
                                        return campaigns;
                                    } else {
                                        throw new Error('There are 0 campaigns to be sent');
                                    }
                                }).then(function (campaigns) {
                            var arrayCampaigns = campaigns;

                            arrayCampaigns.forEach(function (campaign) {

                                var totalSent = 0;
                                var totalError = 0;

                                // console.log('esta es la campaña');
                                //console.log(campaign);

                                // the campaign just started to be sent
                                campaign.datetime_start = new Date().toISOString();

                                models.sequelize.query('select min(email.md5) as md5 from campaign_list left join list ON campaign_list.id_list = list.id left join campaign ON campaign_list.id_campaign = campaign.id left join email_list ON list.id = email_list.id_list left join email on email_list.id_email = email.id where campaign.id=:idCampaign and campaign.status=0 group by email.md5', {
                                    replacements: {
                                        idCampaign: campaign.id
                                    },
                                    type: models.sequelize.QueryTypes.SELECT
                                }).then(function (emails) {

                                    if (emails.length > 0) {
                                        emails.forEach(function (item) {

                                            models.Email
                                                    .findOne({
                                                        where: {
                                                            md5: item.md5
                                                        }
                                                    })
                                                    .then(function (email) {

                                                        if (email) {


                                                            models.sequelize
                                                                    .query('select p.value, p.name, p.description, p.path, p."createdAt" from product p where p.id IN (select cp.id_product from campaign_product cp left join campaign c on cp.id_campaign=c.id where c.value=:val);', {
                                                                        replacements: {
                                                                            val: campaign.value
                                                                        },
                                                                        type: models.sequelize.QueryTypes.SELECT
                                                                    })
                                                                    .then(function (products) {
                                                                        var tokenOpen = jwt.sign({
                                                                            campaignValue: campaign.value,
                                                                            emailMd5: email.md5,
                                                                            sentAt: new Date().toISOString(),
                                                                        }, 'clavetokenclienteservidor');

                                                                        var urlOpen = globals.servidor.protocolo + '://' + globals.servidor.ip + ':' + globals.servidor.port + '/open?token=' + tokenOpen + '&email=' + email.md5;

                                                                        bodyText = campaign.body_html;
                                                                        bodyFinal = bodyText.replace('{{open}}', '<img src="' + urlOpen + '" />');


                                                                        // Reemplazamos los productos ahora
                                                                        var urlProduct, linkProduct, tokenProduct, varImg, varLink;
                                                                        products.forEach(function (product) {
                                                                            tokenProduct = jwt.sign({
                                                                                productValue: product.value,
                                                                                campaignValue: campaign.value,
                                                                                emailMd5: email.md5,
                                                                                sentAt: new Date().toISOString(),
                                                                            }, 'clavetokenclienteservidor');

                                                                            urlProduct = globals.servidor.protocolo + '://' + globals.servidor.ip + ':' + globals.servidor.port + '/products/img?token=' + tokenProduct + '';
                                                                            varImg = '{{img_' + product.value + '}}';
                                                                            bodyFinal = bodyFinal.replace(varImg, urlProduct);

                                                                            linkProduct = globals.servidor.protocolo + '://' + globals.servidor.ip + ':' + globals.servidor.port + '/click?token=' + tokenProduct + '&email=' + email.md5;
                                                                            varLink = '{{link_' + product.value + '}}';
                                                                            bodyFinal = bodyFinal.replace(varLink, linkProduct);
                                                                        });

                                                                        var mailOptions = {
                                                                            from: '"' + campaign.friendly_from + '" <' + username + '>', // sender address
                                                                            to: email.email, // list of receivers
                                                                            subject: campaign.subject, // Subject line
                                                                            text: '', // plain text body
                                                                            html: bodyFinal // html body
                                                                        };

                                                                        // send mail with defined transport object
                                                                        transporter.sendMail(mailOptions, (error, info) => {
                                                                            if (error) {
                                                                                return console.log(error);
                                                                                totalError++;
                                                                            } else {
                                                                                totalSent++;

                                                                                console.log('Message %s sent: %s', info.messageId, info.response);

                                                                            }



                                                                        });
                                                                    });

                                                        }
                                                    });


                                        });
                                    } else {
                                        throw new Error('No emails found for this campaign');
                                    }
                                }).catch(function (err) {
                                    console.log(err.message);
                                });

                                campaign.delivered = totalSent;
                                campaign.undelivered = totalError;
                                campaign.status = 1;
                                campaign.datetime_end = new Date().toISOString();

                                campaign.save().then(function (success) {
                                    console.log('This campaign [' + campaign.name + '] was sent successfully');
                                });


                            });

                            return arrayCampaigns;
                        }).then(function (arrayCampaigns) {
                            if (arrayCampaigns.length > 0) {
                                //console.log('campaigns were sent successfully!');
                                return 6;
                            } else {
                                //console.log('None campaign was sent!');
                                return 0;
                            }
                            console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));


                        }).catch(function (err) {
                            console.log(err.message);
                            return -1;
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    return -1;
                });



    }

};