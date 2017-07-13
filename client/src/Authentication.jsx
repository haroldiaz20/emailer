

import userStore from './store/user.jsx';
import config from './config';

const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        //this.isAuthenticated = false;
        var token = localStorage.getItem("datatoken");
        var autent, urlFetch;
        
        // OJO, SIEMPRE DEBEMOS DE LLAMAR A LA RUTA: /mailer/api/verify,
        // PARA PODER VERIFICAR QUE EL TOKEN QUE SE ESTÁ MANDANDO ES EL CORRECTO
        urlFetch = config.apiRoot + '/mailer/api/auth/verify';

        autent = fetch(urlFetch, {
            'method': 'POST',
            'mode': 'cors',
            cache: 'default',
            'headers': {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
        }).then((response) => response.json()).then((responseJson) => {
            console.log('is this user autenticated? ' + responseJson.success);
            if (responseJson.success === true) {

                this.isAuthenticated = true;
                userStore.setFullName(responseJson.data.full_name);
                userStore.setEmailAddress(responseJson.data.email);

            } else {
                this.isAuthenticated = false;

            }
            
        }).catch((error) => {
            console.error(error);
        });

        // Aqui retornamos la promesa
        return autent;

    },
    signout(cb) {
        this.isAuthenticated = false;
        setTimeout(cb, 100);
    }
}


export default fakeAuth;