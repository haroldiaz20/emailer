'use strict';

var roles = {
    "admin": {
        "routes": ['/home', '/smtp', '/users', '/users/list', '/lists', '/emails', '/products', '/campaigns'],
        
    },
    "sender": {
        "routes": ['/emails', '/products', '/campaigns']
    }
};

module.exports = roles;