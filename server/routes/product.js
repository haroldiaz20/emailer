var models = require('../models');
var formidable = require('formidable');
var path = require('path');
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var im = require('imagemagick');
var fs = require('fs');

var utils = require('../utils');

/* GET products listing. */
router.get('/', function (req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    var userValue;
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'clavetokenclienteservidor', function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.', data: null});    
          } else {
            // let's get the user value from the token
            userValue = decoded.value;
            // Let's find a user from db
            models.User.findOne({where: {token: userValue}})
            .then(function(user){
              if(user !== null){
                  getProducts(user, res, req, next);
              }else{
                   return res.json({
                              "success": false,
                              "message": 'No existe este usuario',
                              "data": null
                          });
              }
            })
            .catch(function(err){
                 return res.json({
                            "success": false,
                            "message": err.message,
                            "data": null
                        });
            });

          }
        });

    }else{
       return res.status(403).json({
                  "success": false,
                  "message": 'No tiene permisos para acceder a este recurso',
                  "data": null
              });
    }


});


function getProducts(user, res, req, next){
    if(user.type === 1){
         models.Product.findAll({
            include: [{ 
                model: models.User, 
                attributes: [
                    'id','token', 'first_name', 'email','last_name',
                ]}
            ]
        })
        .then(function (products) {
            
            return res.json({
                "success": true,
                "message": "Products listed correctly for admin!",
                "data": products
            });
        }).catch(function(err){
            console.log(err);
        });
    }else if(user.type === 2){
         models.Product.findAll({
            where: {
                id_user: user.id
            },
            include: [
                 { model: models.User}
            ],
        })
        .then(function (products) {
            return res.json({
                "success": true,
                "message": 'Products listed correctly for this user ' + user.email + '.',
                "data": products
            });
        }).catch(function(err){
            console.log(err);
        });
    }else{
        return res.json({
            "success": false,
            "message": 'Hubo un error autenticando a este usuario',
            "data": null,
        });
    }

}

router.post('/create', function (req, res, next) {
   // console.log(__dirname + '/../public/images');

    var token = req.body.token || req.query.token || req.headers['x-access-token'];


    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'clavetokenclienteservidor', function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            saveProductAndImages(req, res, next, decoded);   
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


/**
 * This function allows to upload a file and save a product directly from the create campaign form.
 */
router.post('/upload', function (req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    //console.log(req);

/**    return res.status(200).send({ 
            success: true, 
            message: 'File uploaded correctly!!',
            data: {url: 'https://facebook.github.io/react/img/logo.svg'} 
        });
**/
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'clavetokenclienteservidor', function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            saveProductAndImages(req, res, next, decoded);   
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


function saveProductAndImages(req, res, next, decoded){

    var form = new formidable.IncomingForm();
    var fileName;
    form.uploadDir = __dirname + '/../temp';
    form.keepExtensions = true;

    form.parse(req, function(err, fields, files){
        // Read file from temp and move it to the final folder (public/images)
        var picture = files.picture;
        const value = utils.randomValueBase64(12);
        const name = (typeof fields.name !== 'undefined') ? fields.name : value;
       
        const description = (typeof fields.description !== 'undefined') ? fields.description : value;
        console.log('type', picture.type);
        const pictureName = value+'_'+picture.name.split(/\s+/).join('_');

       

        var finalPath = path.join(__dirname + '/../public/images', pictureName);
        fs.readFile(picture.path, function (err, data) {
            if (err) throw err;
            //Do your processing, MD5, send a satellite to the moon, etc.
            fs.writeFile (finalPath, data, function(err) {
                if (err) throw err;
                console.log('uploaded!!');

                 // Let's resize this image
                resizeImage(finalPath, pictureName);
            });
        });

        // Save into db
        userValue = decoded.value;
                
        models.User.findOne({
            where: {token: userValue},
        
        }).then(function(user){
            if(user!==null){
                return user;
            }else{
                throw new Error('No existe el usuario');
            }
        }).then(function(user){
             console.log(description);
        console.log(pictureName);
        console.log(name);
        
            models.Product.create({
                name: name,
                description: description,
                value: value,
                path: pictureName,
                id_user: user.id,
            }).then(function (producto) {
                if(producto){
                     res.json({
                        "success": true,
                        "message": "Producto ("+name+") registrado correctamente.",
                        "data": producto,
                    });     
                }else{
                    throw new Error('no se pudo crear el producto');
                }       
               
            })
        }).catch(function (err) {
            console.log(err);
            res.json({
                "success": false,
                "message": err,
                "data": null
            });
        });

       
        
       
    });
}


function resizeImage(imagePath, pictureName){    

    var fs = require('fs');
    var dir = __dirname + '/../public/images/thumbs';
    var dir256 = __dirname + '/../public/images/thumbs/256x256';
    var dir500 = __dirname + '/../public/images/thumbs/500x500';

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    if (!fs.existsSync(dir256)){
        fs.mkdirSync(dir256);
    }

    if (!fs.existsSync(dir500)){
        fs.mkdirSync(dir500);
    }

    var thumbPath = path.join(dir,pictureName);
    var thumbPath256 = path.join(dir256,pictureName);
    var thumbPath500 = path.join(dir500,pictureName);

    // Resize for 125px
    im.resize({
      srcPath: imagePath,
      dstPath: thumbPath,
      width: 125,
      quality: 0.5,
    }, function(err, stdout, stderr){
      if (err) console.log(err);
      console.log('resized '+pictureName+' to fit within 125x125px');
    });

    // Resize for 256px
    im.resize({
      srcPath: imagePath,
      dstPath: thumbPath256,
      width: 256,
      quality: 0.8,
    }, function(err, stdout, stderr){
      if (err) console.log(err);
      console.log('resized '+pictureName+' to fit within 125x125px');
    });

    // Resize for 500px
    im.resize({
      srcPath: imagePath,
      dstPath: thumbPath500,
      width: 500,
      quality: 0.8,
    }, function(err, stdout, stderr){
      if (err) console.log(err);
      console.log('resized '+pictureName+' to fit within 125x125px');
    });


}


router.get('/img', function (req, res, next) {
   // console.log(__dirname + '/../public/images');

    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    var imageName = 'not-found.jpeg';

    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'clavetokenclienteservidor', function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            // Send image
              var productValue = decoded.productValue;

              models.Product
              .findOne({where: {value: productValue}})
              .then(function(product){
                    if(product!==null){

                        imageName = product.path;
                        enviarImagen(imageName, req, res);


                    }else{
                        throw new Error('no existe este producto');
                    }
              }).catch(function(err){
                    console.log(err);
                    imageName = 'not-found.jpeg';
                    enviarImagen(imageName, req, res);
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


function enviarImagen(nombreImagen, req, res){

    var options = {
        root: __dirname + '/../public/images',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

      
    res.sendFile(nombreImagen, options, function (err) {
        if (err) {
          next(err);
        } else {
          console.log('Sent:', nombreImagen);
        }
    });

}



router.delete('/:value', function (req, res, next) {

    var valueProduct = req.params.value;


    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    var userValue;
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'clavetokenclienteservidor', function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.', data: null});    
          } else {
            // let's get the user value from the token
            userValue = decoded.value;
            // Let's find a user from db
            models.User.findOne({where: {token: userValue}})
            .then(function(user){
              if(user !== null){
                  eliminarProducto(valueProduct, user, res, req, next);
              }else{
                   return res.json({
                              "success": false,
                              "message": 'No existe este usuario',
                              "data": null
                          });
              }
            })
            .catch(function(err){
                 return res.json({
                            "success": false,
                            "message": err.message,
                            "data": null
                        });
            });

          }
        });

    }else{
       return res.status(403).json({
                  "success": false,
                  "message": 'No tiene permisos para acceder a este recurso',
                  "data": null
              });
    }
  




});



function eliminarProducto(valueProduct, user, res, req, next){
    models.Product.findOne({
        where: {
            value: valueProduct,
        }
    })
    .then(function(product){

        if(product!==null) {
            product.destroy();
            return true;
           
        }else{
            throw new Error('hubo un error');
        }
    }).then(function(success){
        if(success===true){
            getProducts(user, res, req, next);
        }
    })
    .catch(function(err){
        return res.json({
            "success": false,
            "message": err,
            "data": null,
        });
    });
}



router.get('/:value', function (req, res, next) {
    
    var valueProduct; 
    if(req.params.value){
        valueProduct = req.params.value;
    }


    models.Product.findOne({
        where: {value: valueProduct}
    })
    .then(function (product) {
        if(product!==null){            
            return res.json({
                "success": true,
                "message": "producto encontrado",
                "data": product
            });
        } else{
            throw new Error('This product doens\'t exists');
        }
            

    }).catch(function(err){
        return res.json({
            "success": false,
            "message": err.message,
            "data": null
        });
    });

});




router.put('/:value', function (req, res, next) {
    
   var token = req.body.token || req.query.token || req.headers['x-access-token'];


    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'clavetokenclienteservidor', function(err, decoded) {      
          if (err) {
            return res.json({ success: false, message: 'Failed to authenticate token.' });    
          } else {
            // if everything is good, save to request for use in other routes
            updateProductAndImages(req, res, next, decoded);   
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


function updateProductAndImages(req, res, next, decoded){

    var form = new formidable.IncomingForm();
    var fileName;
    form.uploadDir = __dirname + '/../temp';
    form.keepExtensions = true;

    form.parse(req, function(err, fields, files){
        // Read file from temp and move it to the final folder (public/images)
        var picture, pictureName;

        var name = fields.name;
        var description = fields.description;
        var value = fields.value;

    
        if(files.picture){
            console.log('esta es la file');
            console.log(files.picture);
            picture = files.picture;

            pictureName = value + '_' + picture.name.split(/\s+/).join('_');

            var finalPath = path.join(__dirname + '/../public/images', pictureName);
            fs.readFile(picture.path, function (err, data) {
                if (err) console.log(err);
                //Do your processing, MD5, send a satellite to the moon, etc.
                fs.writeFile (finalPath, data, function(err) {
                    if (err) console.log(err);
                    console.log('uploaded!!');

                     // Let's resize this image
                    resizeImage(finalPath, pictureName);
                });
            });
        }else{
            console.log('no hay files');pictureName = '';
        }


       
        // Save into db
        userValue = decoded.value;
                
        models.User.findOne({
            where: {token: userValue},
        
        }).then(function(user){
            if(user!==null){
                return user;
            }else{
                throw new Error('No existe el usuario');
            }
        }).then(function(user){

            return models.Product.findOne({where: {
                value: value,
            }}).then(function (product) {

                return product;
               
            }).catch(function(err){
                console.log(err);
            });


        }).then(function(producto){
            if(producto!==null){


                var valores = {
                    name: name,
                    description: description,
                    path: (pictureName!=='') ? pictureName : producto.path,
                };
                
                producto.update(valores).then(function(success){
                    return res.json({
                        "success": true,
                        "message": "Producto ("+name+") actualizado correctamente.",
                        "data": pictureName,
                    }); 
                });
                        
            }else{
                //console.log('no existe el producto');return;
                throw new Error('Este producto no existe');
            }       
        })
        .catch(function (err) {
            console.log(err);
            return res.json({
                "success": false,
                "message": err.message,
                "data": null
            });
        });

       
        
       
    });
}

module.exports = router;
