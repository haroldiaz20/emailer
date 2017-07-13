import React from 'react'
import ReactTable from 'react-table';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import moment from 'moment';

import 'react-table/react-table.css';

import config from '../config';

class UsersListComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {users: []};
    }
    getUserList() {
        var urlFinal = config.apiRoot + '/mailer/api/users';
        return fetch(urlFinal)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({users: responseJson.data})
                    console.log(responseJson);
                })
                .catch((error) => {
                    console.error(error);
                });
    }

    render() {
        const columns = [
            {
                header: 'Created at',
                id: 'createdAt',
                minWidth: 200,
                accessor: d => d.createdAt,
                render: d => (
                            <span>{moment.utc(d.row.createdAt).format("DD-MM-YYYY  hh:mm A")}</span>
                            )
            },
            {
                header: 'Value',
                id: 'value',
                accessor: d => d.token,
                minWidth: 150
            }, {
                header: 'Email',
                id: 'email',
                accessor: d => d.email,
                minWidth: 150
            }, {
                header: 'Name',
                id: 'name',
                accessor: d => d.first_name,
                minWidth: 150
            }, {
                header: 'Last name',
                id: 'lastName',
                accessor: d => d.last_name,
                minWidth: 150
            }, {
                header: 'Phone Number',
                id: 'subject',
                accessor: d => d.phone,
                minWidth: 150
            }, {
                header: 'Type',
                id: 'status',
                minWidth: 100,
                accessor: d => d.type,
                render: row => (
                            <span style={{
                                            padding: 2,
                                            minWidth: '100%',
                                            fontSize: 14,
                                            color: '#000000',
                                            backgroundColor: row.value === 1 ? '#90CAF9'
                                                    : row.value === 2 ? '#4CAF50'
                                                    : '#E3F2FD',
                                            transition: 'all .3s ease'
                                        }}>{
                                row.value === 1 ? 'Admin'
                                              : row.value === 2 ? 'Sender'
                                                  : 'No defined'
                                }
                            </span>
                            )
            }
        ];

        return (
                <Card>			   
                <CardTitle title="Users" subtitle="Users List" />
                <CardText>
                    <ReactTable
                        className='-striped -highlight'
                        data={this.state.users}
                        columns={columns}
                        defaultPageSize={5}
                        defaultSorting={[{
                                id: 'createdAt',
                                desc: true
                                    }]}
                        />
                
                
                </CardText>
                <CardActions>
                
                </CardActions>
                </Card>

                );
    }
    
    componentDidMount() {
        this.getUserList();
    }

}

export default UsersListComponent;