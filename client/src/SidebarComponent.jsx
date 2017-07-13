import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, makeSelectable} from 'material-ui/List';

import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionHome from 'material-ui/svg-icons/action/home';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import ContentSend from 'material-ui/svg-icons/content/send';
import SocialPeople from 'material-ui/svg-icons/social/people';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import ActionList from 'material-ui/svg-icons/action/list';
import ActionShoppingCart from 'material-ui/svg-icons/action/shopping-cart';
import ActionAssignment from 'material-ui/svg-icons/action/assignment';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';

import Subheader from 'material-ui/Subheader';

let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.string.isRequired,
    };

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      });
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      });
    };

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}

SelectableList = wrapState(SelectableList);



class SidebarComponent extends Component {
 
  constructor(props) {
    super(props);
    this.state = {open: false, defaultValue: ""};
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillMount(){ 
      console.log(this.props.location.pathname);
      //this.setState({defaultValue: this.props.location.pathname});
  } 

  handleClose(){
    this.props.changeStatusDrawer(false)
  }

  render() {
    return (        
        <Drawer open={this.props.status} docked={this.props.statusDocked} onRequestChange={(open) => this.props.changeStatusDrawer(open)}>
         <SelectableList defaultValue={"/"}>
            <Subheader>Mailer App</Subheader>            
            <ListItem onTouchTap={this.handleClose} value="/" primaryText={<Link to="/">Home</Link>} leftIcon={<ActionHome />} />
            <ListItem onTouchTap={this.handleClose} value="/smtp" primaryText={<Link to="/smtp">Smtp Config</Link>} leftIcon={<ActionSettings />} />
            <ListItem
              value={3}
              primaryText="Users"
              leftIcon={<SocialPeople />}
              initiallyOpen={false}
              primaryTogglesNestedList={true}
              nestedItems={[
                <ListItem
                  value="/users/create"
                  onTouchTap={this.handleClose}
                  key={1}
                  primaryText={<Link to="/users/create">Create</Link>}
                  leftIcon={<EditorModeEdit />}
                />,               
                 <ListItem
                    value="/users/list"
                    onTouchTap={this.handleClose}
                    key={2}
                    primaryText={<Link to="/users/list">List</Link>}
                    leftIcon={<ActionList />}
                  />,                
              ]}
            />
            <ListItem
              value={6}
              primaryText="Lists"
              leftIcon={<ActionAssignment />}
              initiallyOpen={false}
              primaryTogglesNestedList={true}
              nestedItems={[
                <ListItem
                  value={7}
                  onTouchTap={this.handleClose}
                  key={1}
                  primaryText={<Link to="/lists/create">Create</Link>}
                  leftIcon={<EditorModeEdit />}
                />,               
                 <ListItem
                    value={8}
                    onTouchTap={this.handleClose}
                    key={2}
                    primaryText={<Link to="/lists/list">List</Link>}
                    leftIcon={<ActionList />}
                  />,                
              ]}
            />
            <ListItem
              value={9}
              primaryText="Emails"
              leftIcon={<CommunicationEmail />}
              initiallyOpen={false}
              primaryTogglesNestedList={true}
              nestedItems={[
                <ListItem
                  value={10}
                  onTouchTap={this.handleClose}
                  key={1}
                  primaryText={<Link to="/emails/create">Create</Link>}
                  leftIcon={<EditorModeEdit />}
                />,               
                 <ListItem
                    value={11}
                    onTouchTap={this.handleClose}
                    key={2}
                    primaryText={<Link to="/emails/list">All</Link>}
                    leftIcon={<ActionList />}
                  />,                
              ]}
            />
            <ListItem
              value={12}
              primaryText="Products"
              leftIcon={<ActionShoppingCart />}
              initiallyOpen={false}
              primaryTogglesNestedList={true}
              nestedItems={[
                <ListItem
                  value={13}
                  onTouchTap={this.handleClose}
                  key={1}
                  primaryText={<Link to="/products/create">Create</Link>}
                  leftIcon={<EditorModeEdit />}
                />,               
                 <ListItem
                    value={14}
                    onTouchTap={this.handleClose}
                    key={2}
                    primaryText={<Link to="/products/list">List</Link>}
                    leftIcon={<ActionList />}
                  />,                
              ]}
            />
            <ListItem
              value={15}
              primaryText="Campaigns"
              leftIcon={<ContentDrafts />}
              initiallyOpen={false}
              primaryTogglesNestedList={true}
              nestedItems={[
                <ListItem
                  value={16}
                  onTouchTap={this.handleClose}
                  key={1}
                  primaryText={<Link to="/campaigns/create">Create</Link>}
                  leftIcon={<EditorModeEdit />}
                />,
                <ListItem 
                value={17} 
                onTouchTap={this.handleClose}
                key={2} 
                primaryText={<Link to="/campaigns/tracking">Email Tracking</Link>} 
                leftIcon={<ContentSend />} 
                />,
               
                
              ]}
            />
           
          </SelectableList>
        </Drawer>
    
    );
  }
}

export default SidebarComponent;