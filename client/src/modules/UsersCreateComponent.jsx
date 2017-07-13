import React from 'react'
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { Row, Col } from 'react-flexbox-grid';

import config from '../config';

class UsersCreateComponent extends React.Component {

    constructor(props) {
        super(props);

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleFirstnameChange = this.handleFirstnameChange.bind(this);
        this.handleLastnameChange = this.handleLastnameChange.bind(this);
        this.handlePhoneChange = this.handlePhoneChange.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleAlertHide = this.handleAlertHide.bind(this);


        this.state = {
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            phone: '',
            type: 1,
            user: {},
            items: [],
            roles: [
                {key: 1, label: 'Administrator'},
                {key: 2, label: 'Sender'},
            ],
            alert: {
                message: '',
                open: false
            }
        };
    }

    componentDidMount() {
        var itemsArray = this.state.roles.map(function (item, i) {

            return <MenuItem name={item.key} value={item.key} key={i} primaryText={item.label} />;

        });

        this.setState({items: itemsArray});

    }

    handleTypeChange(event, index, value) {
        //console.log(value);
        //console.log(event.target.name);

        this.setState({type: value});
    }

    handleEmailChange(ev) {
        this.setState({
            email: ev.target.value
        });
    }

    handlePasswordChange(ev) {
        this.setState({
            password: ev.target.value
        });
    }

    handleFirstnameChange(ev) {
        this.setState({
            first_name: ev.target.value
        });
    }

    handleLastnameChange(ev) {
        this.setState({
            last_name: ev.target.value
        });
    }

    handlePhoneChange(ev) {
        this.setState({
            phone: ev.target.value
        });
    }

    handleAlertHide() {
        this.setState({alert: {message: '', open: false}});
    }

    saveUser() {
        const urlFinal = config.apiRoot + '/mailer/api/users/create';
        return fetch(urlFinal, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                phone: this.state.phone,
                password: this.state.password,
                type: this.state.type,
            })
        }).then((response) => response.json()).then((responseJson) => {
            console.log(responseJson);
            if (responseJson.success === true) {
                this.setState({alert: {message: responseJson.message, open: true}});
            } else {
                this.setState({alert: {message: responseJson.message, open: true}});
            }

        }).catch((error) => {
            console.log(error);
        });

    }

    render() {

        return (
                <div className="">
                    <Card>			   
                    <CardTitle title="Users" subtitle="Create User" />
                    <CardText>
                        <Row>
                            <Col xs={12} sm={6} md={6}>
                            <TextField
                                id="text-field-email"
                                value={this.state.email}
                                floatingLabelText="Email"
                                fullWidth={true}
                                onChange={this.handleEmailChange}
                                />
                            </Col>
                            <Col xs={12} sm={6} md={6}>
                            <TextField
                                id="text-field-password"
                                type="Password"
                                value={this.state.password}
                                floatingLabelText="Password"
                                fullWidth={true}
                                onChange={this.handlePasswordChange}
                                />
                            </Col>
                
                        </Row>
                        <Row>
                            <Col xs={12} sm={6} md={6}>
                            <TextField
                                id="text-field-first-name"
                                value={this.state.first_name}
                                floatingLabelText="First name"
                                fullWidth={true}
                                onChange={this.handleFirstnameChange}
                                />
                            </Col>
                            <Col xs={12} sm={6} md={6}>
                            <TextField
                                id="text-field-last-name"
                                value={this.state.last_name}
                                floatingLabelText="Last name"
                                fullWidth={true}
                                onChange={this.handleLastnameChange}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} sm={12} md={12}>
                            <TextField
                                id="text-field-phone"
                                value={this.state.phone}
                                floatingLabelText="Phone Number"
                                fullWidth={true}
                                onChange={this.handlePhoneChange}
                                />
                            </Col>
                
                            <Col xs={12} sm={12} md={12}>
                            <SelectField
                                floatingLabelText="Rol for this user"
                                value={this.state.type}
                                onChange={this.handleTypeChange}
                                maxHeight={200}
                                >
                                {this.state.items}
                            </SelectField>
                            </Col>
                
                        </Row>
                
                    </CardText>
                    <CardActions>
                        <RaisedButton label="Save"  primary={true} onClick={this.saveUser}/>
                        <RaisedButton label="Cancel" />
                    </CardActions>
                    </Card>	  
                    <Snackbar
                        open={this.state.alert.open}
                        message={this.state.alert.message}
                        autoHideDuration={4000}	
                        onRequestClose={this.handleAlertHide}
                        />    			
                </div>
                );
    }

}

export default UsersCreateComponent;