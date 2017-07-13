import React from 'react'
import ReactDOM from 'react-dom';
import App from './App';

import UsersComponent from './modules/UsersComponent.jsx';
import UsersCreateComponent from './modules/UsersCreateComponent.jsx';
import UsersListComponent from './modules/UsersListComponent.jsx';

import HomeComponent from './modules/HomeComponent.jsx';
import SmtpComponent from './modules/SmtpComponent.jsx';
import CampaignsComponent from './modules/CampaignsComponent.jsx';
import CampaignsTrackingComponent from './modules/CampaignTrackingComponent.jsx';
import CampaignsCreateComponent from './modules/CampaignsCreateComponent.jsx';

import NewCampaignsCreateComponent from './modules/NewCampaignsCreateComponent.jsx';

import EmailsComponent from './modules/EmailsComponent.jsx';
import EmailsCreateComponent from './modules/EmailsCreateComponent.jsx';
import EmailsListComponent from './modules/EmailsListComponent.jsx';
import EmailsEditComponent from './modules/EmailsEditComponent.jsx';

import ListsComponent from './modules/ListsComponent.jsx';
import ListsCreateComponent from './modules/ListsCreateComponent.jsx';
import ListsListComponent from './modules/ListsListComponent.jsx';

import ProductsComponent from './modules/ProductsComponent.jsx';
import ProductsListComponent from './modules/ProductsListComponent.jsx';
import ProductsEditComponent from './modules/ProductsEditComponent.jsx';
import ProductsCreateComponent from './modules/ProductsCreateComponent.jsx';


import NotFound from './NotFoundComponent';
import LoginComponent from './LoginComponent.jsx';

import { Router, Route, browserHistory, IndexRoute } from 'react-router'


import fakeAuth from './Authentication.jsx';

import './index.css';

function requireAuth(nextState, replace, callback) {
    fakeAuth.authenticate().then(function(loggedIn) {
        if (!fakeAuth.isAuthenticated) 
            replace({ pathname: '/login', query: { return_to: nextState.location.pathname } })
        callback();
    });
}


ReactDOM.render(
 <Router history={browserHistory}>  
        <Route path="/login" component={LoginComponent}/>
        <Router path="/" onEnter={requireAuth} component={App}>
              
              <Route  path="/smtp" component={SmtpComponent}/>
              <Route path="/users" component={UsersComponent}>
                  <Route path="/users/create" component={UsersCreateComponent}/>
                  <Route path="/users/list" component={UsersListComponent}/>
              </Route>              
              <IndexRoute component={HomeComponent}/>          
              <Route path="/users" component={UsersComponent}>
                <Route path="/users/create" component={UsersCreateComponent}/>
                <Route path="/users/list" component={UsersListComponent}/>
              </Route>
              <Route path="/lists" component={ListsComponent}>
                <Route path="/lists/create" component={ListsCreateComponent}/>
                <Route path="/lists/list" component={ListsListComponent}/>
              </Route>
              <Route path="/emails" component={EmailsComponent}>
                <Route path="/emails/create" component={EmailsCreateComponent}/>   
                <Route path="/emails/list" component={EmailsListComponent}/>        
                <Route path="/emails/edit/:md5" component={EmailsEditComponent}/>        
              </Route> 
              <Route path="/products" component={ProductsComponent}>
                <Route path="/products/create" component={ProductsCreateComponent}/>   
                <Route path="/products/list" component={ProductsListComponent}/>        
                <Route path="/products/edit/:value" component={ProductsEditComponent}/>        
              </Route>               
              <Route path="/campaigns" component={CampaignsComponent}>
                <Route path="/campaigns/create" component={NewCampaignsCreateComponent}/>
                <Route path="/campaigns/tracking" component={CampaignsTrackingComponent}/>
              </Route>
        </Router>
        <Route path="/not-found" component={NotFound} />
        <Route path="*" component={NotFound} />
  </Router>,
  document.getElementById('root')
);

