
import React from 'react';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import ReactTable from 'react-table';
import Snackbar from 'material-ui/Snackbar';
import DialogCampaignDetails from './DialogCampaignDetails.jsx';
import moment from 'moment';
import 'react-table/react-table.css';

import io from 'socket.io-client';
import config from '../config';

const styleDescription = {
    "overflow": "hidden",
    "textOverflow": "ellipsis",
    "whiteSpace": "initial",
};

class TableDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: '', data: [], campaignLists: [], campaignProducts: [], };
        this.fetchDataFromServer = this.fetchDataFromServer.bind(this);


    }

    componentWillMount() {
        this.setState({value: this.props.campaignValue});
        console.log('este es el valor que recibo' + this.props.campaignValue);
        this.fetchDataFromServer();
    }

    fetchDataFromServer() {
        var url = config.apiRoot + '/mailer/api/campaign/' + this.props.campaignValue + '/lists';
        fetch(url)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({campaignLists: responseJson.data});
                    console.log(responseJson);
                })
                .catch((error) => {
                    console.error(error);
                });

        var urlP = config.apiRoot + '/mailer/api/campaign/' + this.props.campaignValue + '/products';
        fetch(urlP)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({campaignProducts: responseJson.data});
                    console.log(responseJson);
                })
                .catch((error) => {
                    console.error(error);
                });
    }

    render() {
        var productUrl = config.apiRoot + '/mailer/api/';
        const columnsProducts = [
            {
                header: 'Value',
                id: 'productValue',
                accessor: d => d.value,
                minWidth: 50

            }, {
                header: 'Name',
                id: 'productName',
                accessor: d => d.name,
                minWidth: 50
            }, {
                header: 'Description',
                id: 'productDescription',
                accessor: d => d.description,
                minWidth: 50,
                render: row => (
                            <div style={styleDescription}>{row.value}</div>
                            )
            }, {
                header: 'Picture',
                id: 'productPicture',
                accessor: d => d.path,
                width: 100,
                render: row => (
                            <img role="presentation" src={productUrl + '/images/' + row.value} width="80"/>
                            )

            }
        ];

        const columnsList = [
            {
                header: 'Value',
                id: 'listValue',
                accessor: d => d.value,
                minWidth: 50
            }, {
                header: 'Name',
                id: 'listName',
                accessor: d => d.name,
                minWidth: 50
            }, {
                header: 'Emails Number',
                id: 'listEmailsNumber',
                accessor: d => d.emails_number,
                minWidth: 50
            },
        ];

        return (<div style={{padding: '20px'}}>
            <h3><em>Campaign Products</em></h3>
            <br />
            <br />
            <ReactTable	          	
                data={this.state.campaignProducts}
                columns={columnsProducts}
                defaultPageSize={5}
                showPagination={true}					          
                />
            <br />
            <br />
            <h3><em>Campaign Lists</em></h3>
            <br />
            <br />
            <ReactTable	          	
                data={this.state.campaignLists}
                columns={columnsList}
                defaultPageSize={5}
                showPagination={true}					          
                />
        </div>
                );
    }

}


class CampaignsTrackingComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {name: "harold",
            campaigns: [],
            columnsDialog: [],
            dataDialog: [],
            dialog: {open: false, title: ''},
            alert: {message: '', open: false}
        };
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleDialogOpen = this.handleDialogOpen.bind(this);
        this.handleAlertHide = this.handleAlertHide.bind(this);
        this.socket = io('http://104.155.177.231:3000');
    }

    componentDidMount() {
        this.getEmailsList();

        this.socket.on('message-new-open', (message) => {
            console.log(message);
            this.setState({campaigns: message});
        });
        this.socket.on('message-new-click', (message) => {
            console.log(message);
            this.setState({campaigns: message});
        });
    }

    componentWillUnmount() {
        this.socket.close();
    }

    handleAlertHide() {
        this.setState({alert: {message: '', open: false}});
    }

    getEmailsList() {
        var token = localStorage.getItem("datatoken");
        var urlFetch = config.apiRoot + '/mailer/api/campaign';
        return fetch(urlFetch, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            }
        }).then((response) => response.json()).then((responseJson) => {
            if (responseJson.success === true) {
                if (responseJson.data.length <= 0) {
                    this.setState({alert: {message: 'No hay campañas creadas por este usuario', open: true}});
                }
                this.setState({campaigns: responseJson.data})
            } else {
                this.setState({alert: {message: responseJson.message, open: true}});
            }

        }).catch((error) => {
            console.error(error);
        });
    }

    handleDialogOpen(value) {
        const columns = [
            {
                header: 'Email',
                id: 'emailOpen',
                accessor: d => d.email,
                minWidth: 200
            }, {
                header: 'Sex',
                id: 'openSex',
                accessor: d => d.sexo,
                minWidth: 50
            }, {
                header: 'Browser',
                id: 'browser',
                accessor: d => d.browser,
                minWidth: 100
            }, {
                header: 'Platform',
                id: 'platform',
                accessor: d => d.platform,
                minWidth: 200
            }, {
                header: 'IP',
                id: 'ip',
                accessor: d => d.ip,
                minWidth: 200
            }, {
                header: 'Count Opens',
                id: 'countOpens',
                accessor: d => d.count,
                minWidth: 150
            }, {
                header: 'Sent At',
                id: 'sentAt',
                accessor: d => d.sent_at,
                minWidth: 200,
                render: d => (
                            //moment.utc({d.row.createdAt}).format("DD-MM-YYYY") 
                            <span>{moment.utc(d.row.sent_at).format("DD-MM-YYYY  hh:mm A")}</span>
                            )
            }, {
                header: 'Opened On',
                id: 'openedOn',
                minWidth: 200,
                accessor: d => d.opened_on,
                render: d => (
                            //moment.utc({d.row.createdAt}).format("DD-MM-YYYY") 
                            <span>{moment.utc(d.row.opened_on).format("DD-MM-YYYY  hh:mm A")}</span>
                            )

            }
        ];
        var url = config.apiRoot + '/mailer/api/campaign/' + value + '/opens';
        return fetch(url)
                .then((response) => response.json())
                .then((responseJson) => {
                    var dataArray = [];
                    if (responseJson.success === true) {
                        dataArray = responseJson.data;
                    }
                    this.setState({columnsDialog: columns, dataDialog: dataArray, dialog: {open: true, title: 'Opens'}});

                })
                .catch((error) => {
                    console.error(error);
                });
    }

    handleDialogClick(value) {
        const columns = [
            {
                header: 'Email',
                id: 'emailOpen',
                accessor: d => d.email,
                minWidth: 200
            }, {
                header: 'Sex',
                id: 'sex',
                accessor: d => d.sexo,
                minWidth: 50
            }, {
                header: 'Browser',
                id: 'browser',
                accessor: d => d.browser,
                minWidth: 100
            }, {
                header: 'Platform',
                id: 'platform',
                accessor: d => d.platform,
                minWidth: 200
            }, {
                header: 'IP',
                id: 'ip',
                accessor: d => d.ip,
                minWidth: 200
            }, {
                header: 'Count Clicks',
                id: 'countClicks',
                accessor: d => d.count,
                minWidth: 150
            }, {
                header: 'Product Name',
                id: 'productName',
                accessor: d => d.product_name,
                minWidth: 150
            }, {
                header: 'Sent At',
                id: 'sentAt',
                accessor: d => d.sent_at,
                minWidth: 200,
                render: d => (
                            //moment.utc({d.row.createdAt}).format("DD-MM-YYYY") 
                            <span>{moment.utc(d.row.sent_at).format("DD-MM-YYYY  hh:mm A")}</span>
                            )
            }, {
                header: 'Clicked On',
                id: 'clickedOn',
                minWidth: 200,
                accessor: d => d.clicked_on,
                render: d => (
                            //moment.utc({d.row.createdAt}).format("DD-MM-YYYY") 
                            <span>{moment.utc(d.row.clicked_on).format("DD-MM-YYYY  hh:mm A")}</span>
                            )
            }
        ];
        var url = config.apiRoot + '/mailer/api/campaign/' + value + '/clicks';
        fetch(url)
                .then((response) => response.json())
                .then((responseJson) => {
                    var dataArray = [];
                    if (responseJson.success === true) {
                        dataArray = responseJson.data;
                    }
                    this.setState({columnsDialog: columns, dataDialog: dataArray, dialog: {open: true, title: 'Clicks'}});
                    console.log(responseJson);
                })
                .catch((error) => {
                    console.error(error);
                });
    }

    handleDialogClose(newVal) {
        this.setState({dialog: {open: newVal, title: ''}});
    }

    render() {
        const columns = [
            {
                header: 'Created at',
                id: 'createdAt',
                minWidth: 150,
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
                minWidth: 200
            }, {
                header: 'Status',
                id: 'status',
                minWidth: 80,
                accessor: d => d.status,
                render: row => (
                            <span style={{
                                            minWidth: 80,
                                            padding: 2,
                                            fontSize: 14,
                                            color: '#000000',
                                            backgroundColor: row.value === 0 ? '#FFCA28'
                                                    : row.value === 1 ? '#4FC3F7'
                                                    : '#E3F2FD',
                                            transition: 'all .3s ease'
                                              }}>{
                                          row.value === 0 ? 'Created'
                                                  : row.value === 1 ? 'Sent'
                                                  : 'Incomplete'
                                }
                            </span>
                            )
            }, {
                header: 'Opens',
                id: 'campaignOpens',
                minWidth: 80,
                accessor: d => d.opens,
                render: (d) => (
                            <a
                                href="#"
                                onClick={(event) => {
                                        event.preventDefault();
                                        console.log(d.row.value);
                                        this.handleDialogOpen(d.row.value);
                                    }}
                                >
                                {d.row.opens}
                            </a>
                            )
            }, {
                header: 'Clicks',
                id: 'campaignClicks',
                minWidth: 80,
                accessor: d => d.clicks,
                render: d => (
                            <a
                                href="#"
                                onClick={(event) => {
                                        event.preventDefault();
                                        this.handleDialogClick(d.row.value);
                                    }}
                                >
                                {d.row.clicks}
                            </a>
                            )
            }, {
                header: 'Friendly From',
                id: 'friendlyFrom',
                accessor: d => d.friendly_from,
                minWidth: 200,
                render: row => (
                            <div style={styleDescription}>{row.value}</div>
                            )
            }, {
                header: 'Subject',
                id: 'subject',
                accessor: d => d.subject,
                minWidth: 200,
                render: row => (
                            <div style={styleDescription}>{row.value}</div>
                            )
            }
        ];


        return(
                <div id="campaignComponent" className="campaign__tracking">
                    <Card>
                    <CardTitle title="Campaigns" subtitle="Track your campaigns" />
                    <CardText>
                
                        <ReactTable
                            className='-striped -highlight'
                            data={this.state.campaigns}
                            columns={columns}
                            defaultPageSize={5}
                            defaultSorting={[{
                                            id: 'createdAt',
                                            desc: true
                                        }]}
                            SubComponent={(row) => {
                                    return (
                                        <TableDetail campaignValue={row.row.value}/>
                                                )
                                }}
                            />	
                            {this.props.children}
                    </CardText>
                    </Card>
                    <Snackbar
                        open={this.state.alert.open}
                        message={this.state.alert.message}
                        autoHideDuration={4000}
                        onRequestClose={this.handleAlertHide}
                        /> 
                    <DialogCampaignDetails dialogInit={this.state.dialog} columnsDialog={this.state.columnsDialog} dataDialog={this.state.dataDialog} handleDialogClose={this.handleDialogClose}/>
                </div>
                );
    }

}

export default CampaignsTrackingComponent;