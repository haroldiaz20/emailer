import React from 'react';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';
import SendEmail from 'material-ui/svg-icons/content/send';
import { Grid, Row, Col } from 'react-flexbox-grid';
import DialogSendEmailTest from './DialogSendEmailTest';

import config from '../config';

class SmtpComponent extends React.Component{

	
	componentDidMount(){
		this.getOutmailConfig();
	}

	constructor(props){
		super(props);
		
		this.handleHostChange = this.handleHostChange.bind(this);
		this.handlePortChange = this.handlePortChange.bind(this);
		this.handleTlsSecureToogle = this.handleTlsSecureToogle.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.saveSmtpConfig = this.saveSmtpConfig.bind(this);
		this.getOutmailConfig = this.getOutmailConfig.bind(this);
		this.handleAlertHide = this.handleAlertHide.bind(this);
		this._handleSendTestEmail = this._handleSendTestEmail.bind(this);
		this._handleEmailChange = this._handleEmailChange.bind(this);
		this._handleMessageChange = this._handleMessageChange.bind(this);

		this._handleDialogCancel = this._handleDialogCancel.bind(this);
		this._handleDialogAccept = this._handleDialogAccept.bind(this);

		this.state = {
			outmail: '',
			id: 0,
			host: '', 
			port: '',
			tls: false,
			password: '',
			username:'',
			email: '',
			message: '',
			alert:{
				message: '',
				open: false
			},
			dialog: {
				open: false,
				title: 'Send Email Test',
			}
		};
	}

	
	getOutmailConfig(){
                var urlFinal = config.apiRoot + '/mailer/api/outmail';
		return fetch(urlFinal).then((response) => response.json()).then((responseJson) => {
	      		console.log(responseJson.data);
	      		if(responseJson.data != null){
	      			this.setState({
				      	id: responseJson.data.id,
						host: responseJson.data.host, 
						port: responseJson.data.port,
						tls: responseJson.data.is_secure,
						password: responseJson.data.password,
						username:responseJson.data.username
					});	
	      		}
		      	
				
	      }).catch((error) => {
	        console.error(error);
	      });
	}

	handleHostChange(ev){
		this.setState({host: ev.target.value});
	}

	handlePortChange(ev){
		this.setState({
          port: parseInt(ev.target.value, 10)
        });
	}

	handleTlsSecureToogle(ev, newVal){
		//console.log(ev.target.checked);
		this.setState({
			tls: newVal
		});
	}

	handlePasswordChange(ev){
		this.setState({
          password: ev.target.value
        });
	}

	handleUsernameChange(ev){
		this.setState({
          username: ev.target.value
        });
	}

	_handleEmailChange(email){
		this.setState({
			email: email
		});
	}

	_handleMessageChange(message){
		this.setState({
			message: message
		});
	}

	_handleDialogCancel(){
		this.setState({
			message: '',
			email: '',
			dialog: {
				open:false,
				title: ''
			},
		});
	}

	_handleDialogAccept(){
		this.sendTestEmail();
	}

	handleAlertHide(){
		this.setState({alert: {message: '', open: false}});
	}

	saveSmtpConfig(){
		
		var urlFetch = config.apiRoot + '/mailer/api/outmail/create';
		return fetch(urlFetch, {
			  method: 'POST',
			  headers: {
			    'Accept': 'application/json',
			    'Content-Type': 'application/json'
			  },
			  body: JSON.stringify({
			    port: this.state.port,
			    host: this.state.host,
			    password: this.state.password,
			    username: this.state.username,
			    tls: this.state.tls,
			  })
			})
	      .then((response) => response.json())
	      .then((responseJson) => {
	        console.log(responseJson);
	        this.setState({alert: {message: responseJson.message, open:true}});
	      })
	      .catch((error) => {
	        console.log(error);
	      });

	}
	_handleSendTestEmail(event){
		this.setState({
			dialog:{
				open: true,
				title: 'Confirm send email test',
			}
		});
	}

	sendTestEmail(){
                var urlTest = config.apiRoot + '/mailer/api/emails/test';
		return fetch(urlTest, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				port: this.state.port,
				host: this.state.host,
				password: this.state.password,
				username: this.state.username,
				isSecure: this.state.tls,
				message: this.state.message,
				email: this.state.email,
			})
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log(responseJson);
			this.setState({
				alert: {
					message: responseJson.message, 
					open:true
				},
				dialog: {
					open:false,
					title: '',
				},
			});
		})
		.catch((error) => {
			console.log(error);
		});
	}

	render() {
		const styles={
		  block: {
		  	marginTop: 25,
		    maxWidth: 250,
		  },
		  toggle: {
		    marginBottom: 16,
		  },
		  thumbOff: {
		    backgroundColor: '#ffcccc',
		  },
		  trackOff: {
		    backgroundColor: '#ff9d9d',
		  },
		  thumbSwitched: {
		    backgroundColor: 'red',
		  },
		  trackSwitched: {
		    backgroundColor: '#ff9d9d',
		  },
		  labelStyle: {
		    color: 'red',
		  },
		};
		
		
		return (
<Grid fluid style={{"marginTop": 30}}>
    <Row>
        <Col xs={12} md={8} mdOffset={3}>
        <Card>			   
        <CardTitle title="SMTP" subtitle="SMTP Configuration" />
        <CardText>
            <div>
                <TextField
                    id="text-field-host-name"
                    value={this.state.host}
                    floatingLabelText="Host"
                    fullWidth={true}
                    onChange={this.handleHostChange}
                    />
            </div>
            <div><TextField
                    id="text-field-port-controlled"
                    value={this.state.port}
                    floatingLabelText="Port"
                    fullWidth={true}
                    onChange={this.handlePortChange}
                    /></div>
            <div style={styles.block}>
                <Toggle
                    id="checkbox-tls-controlled"
                    label="Is TLS secure?"
                    style={styles.toggle}
                    toggled={this.state.tls}
                    onToggle={this.handleTlsSecureToogle}
                    />
            </div>
            <div><TextField
                    id="text-field-username-controlled"
                    value={this.state.username}
                    floatingLabelText="Username"
                    fullWidth={true}
                    onChange={this.handleUsernameChange}
                    /></div>
            <div><TextField
                    id="text-field-password-controlled"
                    value={this.state.password}
                    floatingLabelText="Password"
                    type="password"
                    fullWidth={true}
                    onChange={this.handlePasswordChange}
                    /></div>


        </CardText>
        <CardActions>
            <RaisedButton label="Save"  primary={true} onClick={this.saveSmtpConfig}/>
            <RaisedButton label="Cancel" />
            <RaisedButton label="Send Test"  
                          backgroundColor="#a4c639"
                          labelPosition="before"
                          icon={<SendEmail />}
                          onClick={this._handleSendTestEmail}/>
        </CardActions>
        </Card>	 
        </Col>
    </Row>
    <DialogSendEmailTest isOpened={this.state.dialog.open} 
                         emailTest={this.state.email}
                         handleEmailChange={this._handleEmailChange}
                         handleMessageChange={this._handleMessageChange}
                         messageTest={this.state.message}
                         dialogTitle={this.state.dialog.title}
                         handleDialogAccept={this._handleDialogAccept}
                         handleDialogCancel={this._handleDialogCancel}
                         />
    <Snackbar
        open={this.state.alert.open}
        message={this.state.alert.message}
        onRequestClose={this.handleAlertHide}
        autoHideDuration={4000} />  
</Grid>
	      
	    );
	  }
	

}

export default SmtpComponent;