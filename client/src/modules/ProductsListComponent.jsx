import React from 'react'
import { Link } from 'react-router';
import ReactTable from 'react-table';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import DeleteAction from 'material-ui/svg-icons/action/delete';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';

import {blue500} from 'material-ui/styles/colors';
import DialogConfirmComponent from './DialogConfirmComponent';

import moment from 'moment';
import config from '../config';

import 'react-table/react-table.css';

const imgStyle = {
    "textAlign": "center",
    "display": "block",
    "margin": "auto",
};

const styleDescription = {
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "whiteSpace": "initial",
};
const iconStyles = {
    margin: 0,
    width: 30,
    height: 50,
    padding: 5,
};


class ProductsListComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            products: [],
            alert: {message: '', open: false},
            dialog: {
                open: false,
                message: 'Are you sure you want to delete this email?',
                title: 'Confirm delete email address'
            },
            itemToDelete: '',
        };

        this.getProductsList = this.getProductsList.bind(this);
        this.handleAlertHide = this.handleAlertHide.bind(this);
        this.handleDialogAccept = this.handleDialogAccept.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleDialogOpen = this.handleDialogOpen.bind(this);
    }

    componentDidMount() {
        this.getProductsList();
    }

    handleAlertHide() {
        this.setState({alert: {message: '', open: false}});
    }

    handleDialogClose(blnValue) {
        this.setState({dialog: {open: blnValue, title: '', message: ''}});
    }

    handleDialogOpen(ev) {
        console.log(ev.target.name);
        if (typeof ev.target.name !== 'undefined') {
            var valores = ev.target.name.split("_");
            this.setState({
                itemToDelete: valores[1],
                dialog: {
                    open: true,
                    message: 'Are you sure you want to delete this product?',
                    title: 'Confirm delete product'
                }
            });
        }

    }

    handleDialogAccept() {
        console.log(this.state.itemToDelete);
        var token = localStorage.getItem("datatoken");
        var urlf = config.apiRoot + '/mailer/api/products/' + this.state.itemToDelete;
        return fetch(urlf, {
            "method": 'DELETE',
            "async": true,
            "mode": 'cors',
            "crossDomain": true,
            "headers": {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            }

        }).then((response) => response.json()).then((responseJson) => {
            if (responseJson.success === true) {
                this.setState({
                    products: responseJson.data,
                    itemToDelete: '',
                    alert: {message: responseJson.message, open: true},
                    dialog: {open: false, message: '', title: ''}});

            } else {
                this.setState({alert: {message: responseJson.message, open: true}});

            }


        }).catch((error) => {
            console.log(error);
        });
    }

    getProductsList() {

        var token = localStorage.getItem("datatoken");
        var urlP = config.apiRoot + '/mailer/api/products';
        return fetch(urlP, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            }
        })
                .then((response) => response.json())
                .then((responseJson) => {

                    if (responseJson.success === true) {
                        if (responseJson.data.length <= 0) {
                            this.setState({alert: {message: 'No hay campañas creadas por este usuario', open: true}});
                        }
                        this.setState({products: responseJson.data});
                    } else {
                        this.setState({alert: {message: responseJson.message, open: true}});
                    }

                })
                .catch((error) => {
                    console.error(error);
                });
    }

    render() {
        var urlImage = config.apiRoot + "/mailer/api/images/thumbs/";
        const columns = [
            {
                header: 'Created at',
                id: 'createdAt',
                minWidth: 180,
                accessor: d => d.createdAt,
                render: d => (
                            //moment.utc({d.row.createdAt}).format("DD-MM-YYYY") 
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
                minWidth: 100,
                render: row => (
                            <div style={styleDescription}>{row.value}</div>
                            )
            }, {
                header: 'Description',
                id: 'description',
                accessor: d => d.description,
                minWidth: 150,
                render: row => (
                            <div style={styleDescription}>{row.value}</div>
                            )
            }, {
                header: 'Picture',
                id: 'path',
                accessor: d => d.path,
                minWidth: 100,
                render: row => (
                            <div style={{width: "100%", transition: 'all .3s ease'}}>                               
                                <img role="presentation" style={imgStyle} width="80" src={urlImage + row.value}/>
                            </div>

                            )
            }, {
                header: 'Actions',
                id: 'actions',
                minWidth: 100,
                accessor: d => d.value,
                render: d => (
                            <div>
                                <Link to={"/products/edit/" + d.row.value}><IconButton tooltip="Edit">
                                    <EditorModeEdit style={iconStyles}  />
                                </IconButton></Link>
                                <IconButton name={"iconDelete_" + d.row.value} key={d.row.value} tooltip="Delete"  tooltipPosition="top-right" tooltipStyles={{'zIndex': 10000}} onTouchTap={this.handleDialogOpen}>
                                    <DeleteAction style={iconStyles} color={blue500} />
                                </IconButton>				    
                            </div>
                            )

            }
        ];


        return (
                <div className="products-list__component">
                    <Card>			   
                    <CardTitle title="Products" subtitle="Products List" />
                    <CardText>
                
                        <ReactTable
                            className='-striped -highlight'
                            data={this.state.products}
                            columns={columns}
                            defaultPageSize={5}
                            defaultSorting={[{
                                            id: 'createdAt',
                                            desc: true
                                        }]}
                            />
                
                    </CardText>
                
                    </Card>	
                    <DialogConfirmComponent 
                        dialogMessage={this.state.dialog.message} 
                        dialogTitle={this.state.dialog.title} isOpened={this.state.dialog.open} 
                        handleDialogClose={this.handleDialogClose} callbackFunction={this.handleDialogAccept}
                        />   
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

export default ProductsListComponent;