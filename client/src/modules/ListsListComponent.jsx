import React from 'react'
import ReactTable from 'react-table';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import Toggle from 'material-ui/Toggle';
import Snackbar from 'material-ui/Snackbar';

import DialogConfirmComponent from './DialogConfirmComponent.jsx';
import moment from 'moment';

import ListNameComponent from './ListNameComponent.jsx';
import config from '../config';

import 'react-table/react-table.css';

const styles = {
    block: {
        marginTop: 25,
        maxWidth: 250,
    },
    toggle: {
        marginBottom: 5,
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

class ListsListComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {lists: [], dialog: {message: '', title: '', open: false}, target: {state: false, value: ''},
            alert: {message: '', open: false}, defaultSelectedInput: '', inputClassName: 'active'};
        this.handleEnableListToogle = this.handleEnableListToogle.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleDialogConfirm = this.handleDialogConfirm.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this._handleOnChangeValue = this._handleOnChangeValue.bind(this);
    }

    componentDidMount() {
        this.getEmailsList();
    }

    getEmailsList() {
        var urlFetch = config.apiRoot + '/mailer/api/lists';
        return fetch(urlFetch)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({lists: responseJson.data})
                    console.log(responseJson);
                })
                .catch((error) => {
                    console.error(error);
                });
    }

    handleSnackbarClose() {
        this.setState({alert: {message: '', open: false}});
    }

    handleDialogConfirm() {
        console.log('action confirmed');
        console.log(this.state.target);
        var token = localStorage.getItem("datatoken");
        var urlf = config.apiRoot + '/mailer/api/lists/' + this.state.target.value + '/enable';
        return fetch(urlf, {
            "method": 'POST',
            "async": true,
            "mode": 'cors',
            "crossDomain": true,
            "headers": {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            "body": JSON.stringify({"state": this.state.target.state})

        }).then((response) => response.json()).then((responseJson) => {
            if (responseJson.success === true) {
                this.setState({lists: responseJson.data, target: {state: false, value: ''}, alert: {message: responseJson.message, open: true}, dialog: {open: false, message: '', title: ''}});

            } else {
                this.setState({dialog: {open: false, message: '', title: ''}, target: {state: false, value: ''}, alert: {message: responseJson.message, open: true}});
            }


        }).catch((error) => {
            this.setState({dialog: {open: false, message: '', title: ''}, target: {state: false, value: ''}});
             console.log(error);

        });

    }

    handleDialogClose() {
        this.setState({dialog: {open: false, message: '', title: ''}, target: {state: false, value: ''}});
    }

    handleEnableListToogle(ev, blnChecked) {
        var listName, listValue;

        listName = ev.target.name.split("_");
        listValue = listName[1];

        console.log('listValue: ' + listName);

        this.setState({dialog: {open: true, message: 'Are you sure you want to change this state?', title: 'Confirm change list state'}, target: {state: blnChecked, value: listValue}});
        ev.preventDefault();
    }

    handleChangeInput = (event) => {
        this.setState({
            defaultSelectedInput: event.target.value,
        });
    }
    ;
            handleClickInput = (value) => {

    }
    ;
            _handleOnChangeValue = (data) => {
        console.log('Nuevo Data: ' + data);
    }
    ;
            render() {
        const columns = [
            {
                header: 'Created at',
                id: 'createdAt',
                minWidth: 120,
                accessor: d => d.createdAt,
                render: d => (
                            <span>{moment.utc(d.row.createdAt).format("DD-MM-YYYY  hh:mm A")}</span>
                            )
            },
            {
                header: 'Value',
                id: 'value',
                accessor: d => d.value,
                minWidth: 150
            }, {
                header: 'Name',
                id: 'name',
                accessor: d => d.name,
                minWidth: 150,
                render: d => (
                            <ListNameComponent nameList={d.value} onChangeValue={this._handleOnChangeValue}/>
                            )
            }, {
                header: 'Emails number',
                id: 'emailsNumber',
                accessor: d => d.emails_number,
                minWidth: 100
            }, {
                header: 'Is Enable',
                id: 'isEnable',
                minWidth: 50,
                accessor: d => d.is_enable,
                render: d => (
                            <Toggle
                                id={"checkbox-tls-controlled" + d.row.value}
                                style={styles.toggle}
                                toggled={d.row.is_enable}
                                name={"toogleEnableList_" + d.row.value}
                                onToggle={this.handleEnableListToogle}
                                />


                            )
            }
        ];

        return (
                <Card>			   
                <CardTitle title="Lists" subtitle="Lists List" />
                <CardText>
                    <ReactTable
                        className='-striped -highlight'
                        data={this.state.lists}
                        columns={columns}
                        defaultPageSize={5}
                        defaultSorting={[{
                                        id: 'createdAt',
                                        desc: true
                                    }]}
                        />
                
                </CardText>
                <DialogConfirmComponent dialogMessage={this.state.dialog.message} dialogTitle={this.state.dialog.title} isOpened={this.state.dialog.open} handleDialogClose={this.handleDialogClose} callbackFunction={this.handleDialogConfirm}/>   
                <Snackbar
                    open={this.state.alert.open}
                    message={this.state.alert.message}
                    autoHideDuration={4000}
                    onRequestClose={this.handleSnackbarClose}
                    /> 
                </Card>

                );
    }

}

export default ListsListComponent;