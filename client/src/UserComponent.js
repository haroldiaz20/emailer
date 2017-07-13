import React, { Component } from 'react';
import config from './config';

class UserComponent extends Component {
    componentDidMount() {
        this.getUserList();
    }
    constructor(props) {
        super(props);
        this.state = {users: []};
    }
    getUserList() {
        var urlFetch = config.apiRoot + '/mailer/api/users';
        return fetch(urlFetch)
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({users: responseJson})
                    console.log(responseJson);
                })
                .catch((error) => {
                    console.error(error);
                });
    }
    render() {
        var userList = this.state.users.map(function (user, i) {
            // return statement goes here:
            return <li key={'desc' + i}>{user.email}</li>
        });
        return (
                <div className="userList">
                    <ul>
                        {
                            userList
                        }
                    </ul>
                </div>
                );
    }
}

export default UserComponent;