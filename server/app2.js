var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var useragent = require('express-useragent');

var cors = require('cors');
var multer = require('multer')

var models = require('./models');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var globals = require('./bin/globals');

var app = express();



// Enable CORS
//app.use(cors({credentials: true}));

var index = require('./routes/index');
var users = require('./routes/users');
var outmail = require('./routes/outmail');
var emails = require('./routes/email');
var lists = require('./routes/list');
var products = require('./routes/product');
var auth = require('./routes/auth');
var open = require('./routes/open');
var campaign = require('./routes/campaign');
var click = require('./routes/click');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Enable Session
app.use(session({
    secret: 'Mailer ciente servidor app',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: !true
    },
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://104.155.177.231:9000")
    res.header("Access-Control-Allow-Origin", "http://localhost:3001")
    res.header("Access-Control-Allow-Credentials", true)
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token")
    next();
});

app.use(useragent.express());

app.set('superSecret', 'clavetokenclienteservidor'); // secret variable

// custom routes
app.use('/', index);
app.use('/users', users);
app.use('/outmail', outmail);
app.use('/emails', emails);
app.use('/lists', lists);
app.use('/products', cors(), products);
app.use('/auth', auth);
app.use('/open', open);
app.use('/campaign', campaign);
app.use('/click', click);


// Route for OPEN image
app.get('/file/open', function(req, res, next) {

    var options = {
        root: __dirname + '/public/images',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var fileName = 'open_img.png'; //req.params.name;
    res.sendFile(fileName, options, function(err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });

});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});




// This is the daemon we're gonna call
function doThing() {
  console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
    models.Outmail
        .findOne()
        .then(function(outmail) {
            if(outmail!== null){
                 sendEmail(outmail);
            }else{
                // enviamos el correo
                throw new Error('no existe la configuracion smtp');
           }
            
        }).catch(function(err) {
            console.log(err.message);
        });

    // ejecutamos el demonio c/ 15 min
    setTimeout(doThing, 900000);
}

function sendEmail(outmail){

            var poolConfig = {
                pool: true,
                host: outmail.host,
                port: outmail.port,
                secure: outmail.is_secure, // use TLS
                auth: {
                    user: outmail.username,
                    pass: outmail.password,
                }
            };
            var transporter = nodemailer.createTransport(poolConfig);

           
            var campaignsArray, campaignInit, emailInit, bodyText, bodyFinal, campaignInit2;

            transporter.verify(function(error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Server is ready to take our messages');

                    // Let's get all campaigns hat haven been sent 

                    models.Campaign.findAll({
                            where: {
                                status: 0
                            }
                        })
                        .then(function(campaigns) {
                            if (campaigns.length > 0) {
                                return campaigns;
                            } else {
                                throw new Error('There are 0 campaigns to be sent');
                            }
                        }).then(function(campaigns) {
                            var arrayCampaigns = campaigns;
                          
                            arrayCampaigns.forEach(function(campaign) {

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
                                }).then(function(emails) {
                                        
                                        if (emails.length > 0) {
                                            emails.forEach(function(item) {

                                                models.Email
                                                    .findOne({
                                                        where: {
                                                            md5: item.md5
                                                        }
                                                    })
                                                    .then(function(email) {

                                                        if (email) {


                                                            models.sequelize
                                                            .query('select p.value, p.name, p.description, p.path, p."createdAt" from product p where p.id IN (select cp.id_product from campaign_product cp left join campaign c on cp.id_campaign=c.id where c.value=:val);', {
                                                                        replacements: {
                                                                            val: campaign.value
                                                                        },
                                                                        type: models.sequelize.QueryTypes.SELECT
                                                            })
                                                            .then(function(products) {
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
                                                                products.forEach(function(product){
                                                                    tokenProduct = jwt.sign({
                                                                        productValue: product.value,
                                                                        campaignValue: campaign.value,
                                                                        emailMd5: email.md5,
                                                                        sentAt: new Date().toISOString(),
                                                                    }, 'clavetokenclienteservidor');

                                                                    urlProduct = globals.servidor.protocolo + '://' + globals.servidor.ip + ':' + globals.servidor.port + '/products/img?token=' + tokenProduct + '';
                                                                    varImg = '{{img_' + product.value + '}}';
                                                                    bodyFinal = bodyFinal.replace(varImg, urlProduct);

                                                                    linkProduct = globals.servidor.protocolo + '://' + globals.servidor.ip + ':' + globals.servidor.port + '/click?token=' + tokenProduct + '&email='+ email.md5;
                                                                    varLink = '{{link_' + product.value + '}}';
                                                                    bodyFinal = bodyFinal.replace(varLink, linkProduct);
                                                                });

                                                                var mailOptions = {
                                                                    from: '"'+campaign.friendly_from+'" <'+outmail.username+'>', // sender address
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
                                                                    }else{
                                                                        totalSent++;

                                                                        console.log('Message %s sent: %s', info.messageId, info.response);

                                                                    }

                                                                   
                                                                   
                                                                });
                                                            });  
                                                            
                                                        }
                                                    });


                                            });
                                        }else{
                                          throw new Error('No emails found for this campaign');
                                        }
                                }).catch(function(err){
                                    console.log(err.message);
                                });

                                campaign.delivered = totalSent;
                                campaign.undelivered = totalError;
                                campaign.status = 1;
                                campaign.datetime_end = new Date().toISOString();

                                campaign.save().then(function(success){
                                    console.log('This campaign ['+campaign.name+'] was sent successfully');
                                });


                            });

                            return arrayCampaigns;
                        }).then(function(arrayCampaigns){
                            if(arrayCampaigns.length > 0){
                              console.log('campaigns were sent successfully!');
                            }else{
                              console.log('None campaign was sent!');
                            }
                            console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
                        }).catch(function(err) {
                            console.log(err.message);
                        });


                }
            });

}



doThing();




module.exports = app;
