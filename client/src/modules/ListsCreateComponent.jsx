import React from 'react'
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import Toggle from 'material-ui/Toggle';
import RaisedButton from 'material-ui/RaisedButton';
import config from '../config';

class ListsCreateComponent extends React.Component {

    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleEnableListToogle = this.handleEnableListToogle.bind(this);

        this.saveEmailAccount = this.saveEmailAccount.bind(this);

        this.state = {
            name: '',
            enable: false,
            alert: {
                message: '',
                open: false
            }
        };
    }

    handleNameChange(ev) {
        this.setState({
            name: ev.target.value,
        });
    }

    handleEnableListToogle(ev, val) {
        this.setState({
            enable: val,
        });
    }

    saveEmailAccount() {

        //alert(''+ this.state + '');

        var token = localStorage.getItem("datatoken");
        var urlFetch = config.apiRoot + '/mailer/api//lists/create';
        return fetch(urlFetch, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify({
                name: this.state.name,
                enable: this.state.enable,
            })
        }).then((response) => response.json()).then((responseJson) => {
            console.log(responseJson);
            this.setState({alert: {message: responseJson.message, open: true}});
        }).catch((error) => {
            console.log(error);
        });

    }

    render() {
        const styles = {
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
                <div className="">
                    <Card>			   
                    <CardTitle title="Lists" subtitle="Create List" />
                    <CardText>
                        <div>
                            <TextField
                                id="text-field-name"
                                value={this.state.name}
                                floatingLabelText="Name"
                                fullWidth={true}
                                onChange={this.handleNameChange}
                                />
                        </div>
                        <div style={styles.block}>
                            <Toggle
                                id="checkbox-tls-controlled"
                                label="Is this LIST enable?"
                                style={styles.toggle}
                                toggled={this.state.enable}
                                onToggle={this.handleEnableListToogle}
                                />
                        </div>
                
                    </CardText>
                    <CardActions>
                        <RaisedButton label="Save" onClick={this.saveEmailAccount}/>
                        <RaisedButton label="Cancel" />
                    </CardActions>
                    </Card>	  
                    <Snackbar
                        open={this.state.alert.open}
                        message={this.state.alert.message}
                        autoHideDuration={4000}
                
                        />    			
                </div>
                );
    }

}

export default ListsCreateComponent;