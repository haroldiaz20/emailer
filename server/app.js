var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var useragent = require('express-useragent');

var cors = require('cors');
var multer = require('multer');

var models = require('./models');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var globals = require('./bin/globals');

var utils = require('./utils');

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

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://104.155.177.231:9000");
    //res.header("Access-Control-Allow-Origin", "http://localhost:3001");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token")
    next();
});

app.use(useragent.express());

app.set('superSecret', 'clavetokenclienteservidor'); // secret variable

// custom routes
app.use('/api', index);
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
app.get('/file/open', function (req, res, next) {

    var options = {
        root: __dirname + '/public/images',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var fileName = 'open_img.png'; //req.params.name;
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        } else {
            console.log('Sent:', fileName);
        }
    });

});



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    if (req.app.get('env') === 'development') {
        res.json({
            "message": err.message,
            "error": err,
        }).send();
    } else {
        res.render('error');
    }



});




// This is the daemon we're gonna call
function doThing() {
    console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
    models.Outmail
            .findOne()
            .then(function (outmail) {
                if (outmail !== null) {
                    console.log("existe el outmail");
                    //console.log(outmail);
                    utils.sendEmail(outmail.host, outmail.port, outmail.is_secure, outmail.username, outmail.password, false, '', '').then(function (result) {
                        if (result > -1) {
                            console.log('Se enviaron: ' + result + ' campañas');
                        } else {
                            console.log('Hubo un error tratando de enviar las campañas');
                        }
                    });


                } else {
                    // enviamos el correo
                    throw new Error('no existe la configuracion smtp');
                }

            }).catch(function (err) {
        console.log(err.message);
    });

    // ejecutamos el demonio c/ 3 min
    setTimeout(doThing, 30000);
}



doThing();




module.exports = app;
