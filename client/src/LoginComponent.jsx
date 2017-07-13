import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

import { browserHistory } from 'react-router';

// configuration file
import config from './config';

class LoginComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {email: '', password: '', alert: {message: '', open: false}};

        this.handleEmailChangeName = this.handleEmailChangeName.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCloseMessage = this.handleCloseMessage.bind(this);
    }

    handleEmailChangeName(event) {

        this.setState({email: event.target.value});

    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleCloseMessage() {
        this.setState({alert: {message: '', open: false}});
    }

    handleSubmit(event) {
        event.preventDefault();
        
        if (this.state.email === '' || this.state.email === null) {
            this.setState({alert: {message: 'Email address is required', open: true}});
            return;
        }

        if (this.state.password === '' || this.state.password === null) {
            this.setState({alert: {message: 'Password is required', open: true}});
            return;
        }

        var returnTo;
        if (this.props.location.query.return_to) {
            returnTo = this.props.location.query.return_to;
        } else {
            returnTo = '/';
        }

        var urlFetch = config.apiRoot + '/mailer/api/auth';

        return fetch(urlFetch, {
            'method': 'POST',
            'mode': 'cors',
            'cache': 'default',
            'headers': {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            'body': JSON.stringify({
                'email': this.state.email,
                'password': this.state.password,

            })
        }).then((response) => response.json()).then((responseJson) => {

            if (responseJson.success === true) {
                localStorage.setItem('datatoken', responseJson.data.token);
                browserHistory.push(returnTo);
            } else {
                this.setState({alert: {message: responseJson.message, open: true}});
            }


        }).catch((error) => {
            console.log(error);
        });


    }

    render() {
        return (
                <MuiThemeProvider>
                    <Card style={{maxWidth: 400, 'margin': 'auto', 'marginTop': 200}} expanded={true}>
                    <CardHeader
                        title="Mailer App"
                        subtitle="Please, log in"
                        actAsExpander={false}
                        showExpandableButton={false}
                        />
                
                    <CardText expandable={true}>
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                id="text-field-email"
                                hintText="Input your email address"
                                value={this.state.email}
                                onChange={this.handleEmailChangeName}
                                floatingLabelText="Email Address"
                                fullWidth={true}
                                />
                            <TextField
                                id="text-field-password"
                                hintText="Input your password"
                                value={this.state.password}
                                onChange={this.handlePasswordChange}
                                floatingLabelText="Password"
                                fullWidth={true}
                                type="Password"
                                />
                
                
                
                        </form>
                    </CardText>
                    <CardActions>
                        <RaisedButton label="Submit" primary={true} onClick={this.handleSubmit}/>
                        <RaisedButton label="Cancel" />
                    </CardActions>
                    <Snackbar
                        open={this.state.alert.open}
                        message={this.state.alert.message}
                        autoHideDuration={4000}
                        onRequestClose={this.handleCloseMessage}
                        />
                    </Card>
                
                </MuiThemeProvider>
                );
    }

    componentDidMount() {
        console.log(config.apiRoot);
    }
}

export default LoginComponent;