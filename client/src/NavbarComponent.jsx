import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { browserHistory } from 'react-router';

import userStore from './store/user.jsx';

class Logged extends React.Component {
  	static muiName = 'IconMenu';

  	constructor(props) {
		super(props);

	    this.state = {
		    openDialog: false,
		 };
	    this.handleAccept = this.handleAccept.bind(this);
	    this.handleOpen = this.handleOpen.bind(this);
	    this.handleClose = this.handleClose.bind(this);
	   
	}
	 handleAccept(e) {
	 	localStorage.removeItem('datatoken');
	 	browserHistory.push('/login');
	 }

	 handleOpen(e){
	 	this.setState({openDialog: true});
	 }

	 handleClose(e){
	 	this.setState({openDialog: false});
	 }



	 render() {
	  	const actions = [
	      <FlatButton
	        label="Yes, I'm"
	        primary={true}
	        onTouchTap={this.handleAccept}
	      />,
	      <FlatButton
	        label="No, I'm not"
	        primary={false}
	        disabled={false}
	        onTouchTap={this.handleClose}
	      />,
	    ];

	    return (
	    	<div>
	    		      <IconMenu
		    {...this.props}
		    iconButtonElement={
		      <IconButton><MoreVertIcon /></IconButton>
		    }
		    targetOrigin={{horizontal: 'right', vertical: 'top'}}
		    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
		  >
		    <MenuItem primaryText="Settings" />
		    <MenuItem primaryText="Help" />
		    <MenuItem primaryText="Sign out" onClick={this.handleOpen}/>
		  </IconMenu>
		  <Dialog
          title="Are you sure?"
          actions={actions}
          modal={true}
          open={this.state.openDialog}
        >
          Are you sure you want to SIGN OUT from this app?
        </Dialog>
	    	</div>

	    );
	  }
}

class TitleBar extends React.Component {
	render(){
		return (
			<div>
				<span className="appBarTitle">{userStore.fullName + ' '}</span>
				<span className="appBarSubTitle">[ {userStore.emailAddress} ]</span>
			</div>
			
		);
	}
}

/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */
class NavbarComponent extends React.Component {
	constructor(props) {
		super(props);
	    this.state = {open: true};
	    this.handleClick = this.handleClick.bind(this);
	    
	}
	componentDidMount(){
		this.setState({open: this.props.statusDrawer})
	}

	handleClick(e) {
	    //var status = e.target.value;
	  
	    var newValue;
	    if(this.props.statusDrawer == true){
	     	newValue = false;
	    }else{
	       newValue = true;
	    }
	   
	    this.props.onClickProp(newValue);
	}


	render(){
		 return (		 	
		 	<AppBar className="side-bar-component"
		 	 title={<TitleBar />} 
		 	 onLeftIconButtonTouchTap={this.handleClick}
		 	iconElementRight={<Logged />}/>
		 	
		  );
	}

}

export default NavbarComponent;