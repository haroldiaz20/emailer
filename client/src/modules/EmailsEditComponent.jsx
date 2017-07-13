import React from 'react'
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import { browserHistory } from 'react-router';

import config from '../config';

const styles = {
    block: {
        maxWidth: 250,
    },
    radioButton: {
        marginBottom: 16,
    },
};

class EmailsEditComponent extends React.Component {

    constructor(props) {

        super(props);
        console.log('public priperties');
        console.log(props);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleAgeChange = this.handleAgeChange.bind(this);
        this.getListList = this.getListList.bind(this);
        this.handleListOnCheck = this.handleListOnCheck.bind(this);
        this.saveEmailAccount = this.saveEmailAccount.bind(this);
        this.handleSexChange = this.handleSexChange.bind(this);
        this.handleAlertHide = this.handleAlertHide.bind(this);
        this.isSelectedList = this.isSelectedList.bind(this);

        this.state = {
            lists: [],
            checkedList: [],
            email: '',
            country: '',
            age: '',
            sex: '',
            alert: {
                message: '',
                open: false
            }
        };
    }

    componentDidMount() {

        this.getListList();
        // Ya tenemos laslistas, ahora mostramos las seleccionadas 
        this.getSelectedLists();
    }

    handleEmailChange(ev) {
        //console.log(ev.target.value);
        this.setState({
            email: ev.target.value,
        });
    }

    handleCountryChange(ev) {
        this.setState({
            country: ev.target.value,
        });
    }

    handleListOnCheck(ev, checked) {
        var arrayChecked = this.state.checkedList;
        var objList;
        console.log('sss');
        objList = {value: ev.target.name, id: ev.target.id, state: checked, isNew: false};
        //arrayChecked.push(objList);

        const index = arrayChecked.map((lista) => lista.value).indexOf(ev.target.name);

        if (index > -1) {
            if (arrayChecked[index].isNew === true) {
                if (checked === true) {
                    objList.isNew = true;
                    arrayChecked.push(objList);
                } else {
                    arrayChecked.splice(index, 1);
                }
            } else {
                arrayChecked[index] = objList;
            }


        } else {
            objList.isNew = true;
            if (checked === true) {
                arrayChecked.push(objList);
            } else {
                arrayChecked.splice(index, 1);
            }
        }


        console.log(arrayChecked);
        this.setState({
            checkedList: arrayChecked,
        });
    }

    handleAgeChange(ev) {
        this.setState({
            age: parseInt(ev.target.value, 10),
        });
    }

    handleSexChange(ev, value) {
        this.setState({
            sex: value,
        });
    }

    handleAlertHide() {
        this.setState({alert: {message: '', open: false}});
    }

    getListList() {
        var urlFetch = config.apiRoot + '/mailer/api/lists';
        return fetch(urlFetch)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({lists: responseJson.data});


                })
                .catch((error) => {
                    console.error(error);
                });
    }

    getSelectedLists() {
        
        var url = config.apiRoot + '/mailer/api/emails/' + this.props.params.md5;
        var objLista;
        return fetch(url)
                .then((response) => response.json())
                .then((responseJson) => {
                    var listasSeleccionadas = this.state.checkedList;
                    var arrayListas = responseJson.data.Lists;

                    if (arrayListas.length > 0) {
                        arrayListas.forEach(function (item) {
                            objLista = {value: item.value, id: item.id, state: item.EmailList.state, isNew: false};
                            listasSeleccionadas.push(objLista);
                        });
                    }

                    this.setState({email: responseJson.data.email, country: responseJson.data.country,
                        sex: responseJson.data.sexo, age: responseJson.data.age, checkedList: listasSeleccionadas})

                })
                .catch((error) => {
                    console.error(error);
                });
    }

    isSelectedList(value) {
        ///console.log("Value: " + value);
        var arrayLists = this.state.checkedList;

        if (arrayLists.length > 0) {
            const indice = arrayLists.map((lista) => lista.value).indexOf(value);

            // var indice = arrayLists.indexOf(value);
            if (indice > -1) {
                // OJO: Tiene que verificarse que es valor de esta variable "state" sea igual a la recibida por la rpta del API. Es decir para indicar que es verdadero puede ser 1 o true. Nótese los 3 iguales (===).
                if (arrayLists[indice].state === 1 || arrayLists[indice].state === true) {
                    //console.log('1');
                    return true;
                } else {
                    //console.log('2');
                    return false;
                }
            } else {
                //console.log('3');
                return false;
            }
        } else {
            //console.log('4');
            return false;
        }


    }

    saveEmailAccount() {

        //alert(''+ this.state + '');
        var token = localStorage.getItem("datatoken");
        var urlFetch = config.apiRoot + '/mailer/api/emails/create';
        return fetch(urlFetch, {
            "method": 'POST',
            "async": true,
            "crossDomain": true,
            "headers": {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify({
                email: this.state.email,
                country: this.state.country,
                age: this.state.age,
                lists: this.state.checkedList,
                sex: this.state.sex,
            })
        })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    this.setState({alert: {message: responseJson.message, open: true}});
                    setTimeout(() => {
                        if (responseJson.success == true) {
                            browserHistory.push('/emails/list');
                        }
                    }, 2500);

                })
                .catch((error) => {
                    console.log(error);
                });

    }

    render() {
        var _this = this;
        var listsList = this.state.lists.map(function (value, i) {
            // return statement goes here:
            var checkbox = <Checkbox  checked={_this.isSelectedList(value.value)} 
                       name={value.value} id={value.id} key={value.id} onCheck={_this.handleListOnCheck}/>;
            return <ListItem
                key={'list' + i + 1}
                leftCheckbox={checkbox}
                primaryText={value.value}
                secondaryText={value.name}/>

        });

        return (
                <div className="">
                    <Card>			   
                    <CardTitle title="Emails" subtitle="Edit Email" />
                    <CardText>
                        <div>
                            <TextField
                                id="text-field-email"
                                value={this.state.email}
                                floatingLabelText="Email"
                                fullWidth={true}
                                onChange={this.handleEmailChange}
                                />
                        </div>
                        <div><TextField
                                id="text-field-country"
                                value={this.state.country}
                                floatingLabelText="Country"
                                fullWidth={true}
                                onChange={this.handleCountryChange}
                                /></div>
                
                        <div><TextField
                                id="text-field-age"
                                value={this.state.age}
                                floatingLabelText="Age"
                                fullWidth={true}
                                onChange={this.handleAgeChange}
                                /></div>
                        <Subheader>Choose your Sex</Subheader>
                        <RadioButtonGroup name="emailUserSex" valueSelected={this.state.sex} onChange={this.handleSexChange}>
                            <RadioButton
                                value="M"
                                label="Male"
                                style={styles.radioButton}
                                />
                            <RadioButton
                                value="F"
                                label="Female"
                                style={styles.radioButton}
                                />
                            <RadioButton
                                value="NE"
                                label="No Specified"
                                style={styles.radioButton}
                                />
                
                        </RadioButtonGroup>
                        <br></br>
                        <Divider />
                
                        <List>
                        <Subheader>Choose one or more list(s) for this email account</Subheader>
                        <div className="list--container">
                            {
                                listsList
                            }
                        </div>
                
                        </List>
                
                    </CardText>
                    <CardActions>
                        <RaisedButton label="Save"  primary={true} onClick={this.saveEmailAccount}/>
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

export default EmailsEditComponent;