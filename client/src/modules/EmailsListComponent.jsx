import React from 'react'
import { Link } from 'react-router';
import ReactTable from 'react-table';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';
import DeleteAction from 'material-ui/svg-icons/action/delete';
import DialogConfirmComponent from './DialogConfirmComponent.jsx';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ActionDone from 'material-ui/svg-icons/action/done';


import {blue500} from 'material-ui/styles/colors';
import Snackbar from 'material-ui/Snackbar';
import moment from 'moment';

import config from '../config';

import 'react-table/react-table.css';

const iconStyles = {
	  margin: 0,
	  width: 30,
	  height: 50,
	  padding: 5, 
	};

class EmailsListComponent extends React.Component{

	componentDidMount() {
		this.getEmailsList();
	}
	
	constructor(props) {
		super(props);

		this.state = {
			valueSingle: 0,
			emails: [], 
			dialog:{
				open: false, 
				message:'Are you sure you want to delete this email?', 
				title: 'Confirm delete email address'
			}, 
			alert:{
				message: '',
				open: false
			},
			itemToDelete: '',
			itemToActivate: '',
		};

		this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
		this.handleDialogClose = this.handleDialogClose.bind(this);
		this.handleDialogOpen = this.handleDialogOpen.bind(this);
		this.callback = this.callback.bind(this);
		this.handleActivateMenu = this.handleActivateMenu.bind(this);
	
	}
	getEmailsList() {
            
            var urlEmails = config.apiRoot + '/mailer/api/emails';
	  
        return fetch(urlEmails)
	      .then((response) => response.json())
	      .then((responseJson) => {
	      	if(responseJson.success === false){
	      		this.setState({alert:{message: responseJson.message,open: true}});
	      	}else{
	      		this.setState({emails: responseJson.data})
	      	}
	      
	        
	      })
	      .catch((error) => {
	        console.error(error);
	      });
	}

	handleSnackbarClose(){
		this.setState({alert:{message: '',open: false,}});
	}


	handleDialogClose(blnValue){
		this.setState({dialog:{open: blnValue, title: '', message: ''}});
	}

	handleDialogOpen(ev){
		console.log(ev.target.name);
		if (typeof ev.target.name !== 'undefined') {
			var valores = ev.target.name.split("_");
			this.setState({
				itemToDelete: valores[1], 
				dialog:{
					open: true,
					message:'Are you sure you want to delete this email?', 
					title: 'Confirm delete email address'
				}
			});
		}

	}


	callback(){
	
		console.log(this.state.itemToDelete);
		var token = localStorage.getItem("datatoken");
		var urlf= config.apiRoot + '/mailer/api/emails/'+this.state.itemToDelete;
		return fetch(urlf, {
			"method": 'DELETE',
			"async": true,
			"mode": 'cors',
  			"crossDomain": true,
			"headers": {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-access-token' : token,
			}
			
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(responseJson.success === true){
				this.setState({
					emails: responseJson.data, 
					itemToDelete: '', 
					alert: {message: responseJson.message, open:true}, 
					dialog:{open: false, message:'', title: ''}});
				
			}else{
				this.setState({alert: {message: responseJson.message, open:true}});

			}
			

		})
		.catch((error) => {
			console.log(error);
		});
	}

	handleActivateMenu(ev, value){
		console.log(value);
		if (value !== 'undefined') {


			var valores = value.split("_");
			var token = localStorage.getItem("datatoken");

			var urld = config.apiRoot + '/mailer/api/emails/'+valores[1]+'/activate';
			return fetch(urld, {
				"method": 'POST',
				"async": true,
				"mode": 'cors',
	  			"crossDomain": true,
				"headers": {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'x-access-token' : token,
				}
				
			})
			.then((response) => response.json())
			.then((responseJson) => {
				if(responseJson.success === true){
					this.setState({emails: responseJson.data, itemToActivate: '', alert: {message: responseJson.message, open:true}});
					
				}else{
					this.setState({alert: {message: responseJson.message, open:true}});

				}
				

			})
			.catch((error) => {
				console.log(error);
			});

		}


	}



	render() {
		const columns = [
		  {
		    header: 'Created at',
		    id: 'createdAt',
		    minWidth:150,
		    accessor: d => d.createdAt,		   
		   	render: d => (
		   		 //moment.utc({d.row.createdAt}).format("DD-MM-YYYY") 
<span>{moment.utc(d.row.createdAt).format("DD-MM-YYYY  hh:mm A")}</span>
		   	)
		  },
		  {
		    header: 'Email',
		    id: 'email',
		    accessor: d => d.email,
		    minWidth: 200
		  }, {
		    header: 'Md5',
		    id: 'md5',
		    accessor: d => d.md5,
		    minWidth: 300
		  }, {
		    header: 'State',
		    id: 'state',
		    accessor: d => d.state,
		    render: row => (
		      
<span style={{
		          padding: 2,
		          minWidth: '100%',
		          fontSize: 14,
		          color: '#000000',
		          backgroundColor: row.value === 1 ? '#64B5F6'
		            : row.value === 0 ? '#FFC107'
		            : row.value === 2 ? '#D32F2F'
		            : '#E3F2FD',
		          transition: 'all .3s ease'
		        }}>{
		          row.value === 1 ? 'Enabled'
		          : row.value === 0 ? 'Disabled'
		          : row.value === 2 ? 'Deleted'
		          : 'No defined'
    }
</span>
		    )
		  },{
		    header: 'Age',
		    id: 'age',
		    accessor: d => d.age,
		    minWidth: 80
		  },{
		    header: 'Country',
		    id: 'country',
		    minWidth: 100,
		    accessor: d => d.country,
	  	},{
		    header: 'Sex',
		    id: 'sex',
		    accessor: d => d.sexo,
		    minWidth: 100,
		    render: row => (
		      
<span style={{
		          padding: 2,
		          minWidth: '100%',
		          fontSize: 14,
		          color: '#FFFFFF',
		          backgroundColor: row.value === 'M' ? '#1976D2'
		            : row.value === 'F' ? '#F06292'
		            : '#BDBDBD',
		          transition: 'all .3s ease'
		        }}>{
		          row.value === 'M' ? 'Male'
		          : row.value === 'F' ? 'Female'
		          : 'No Specified'
    }
</span>
		    )
		  },{
		    header: 'Actions',
		    id: 'actions',
		    minWidth:100,
		    accessor: d => d.md5,	
		    render: d => (
<div>
    { 
	    			(d.row.state == 1 || d.row.state == 0) ? 
    <div>
        <Link to={"/emails/edit/"+d.row.md5}><IconButton tooltip="Edit">
            <EditorModeEdit style={iconStyles}  />
        </IconButton></Link>
        <IconButton name={"iconDelete_" + d.row.md5} key={d.row.md5} tooltip="Delete" onTouchTap={this.handleDialogOpen}>
            <DeleteAction style={iconStyles} color={blue500} />
        </IconButton>
    </div> 
	    			: (d.row.state == 2) ?
    <IconMenu
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
				          onChange={this.handleActivateMenu}
				          value={this.state.valueSingle}
				          
				        >
        <MenuItem value={"iconToActivate_"+d.row.md5}  primaryText="Activate" leftIcon={<ActionDone />}/>

    </IconMenu>
	    			: 'Undefined' 
    }
</div>

			    	

		   	)   
		   
}
];

return (    	
<div>
    <Card>			   
    <CardTitle title="Emails" subtitle="Emails List" />
    <CardText>
        <ReactTable
            className='-striped -highlight'
            data={this.state.emails}
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
        handleDialogClose={this.handleDialogClose} callbackFunction={this.callback}
        />   	
    <Snackbar
        open={this.state.alert.open}
        message={this.state.alert.message}
        autoHideDuration={4000}
        onRequestClose={this.handleSnackbarClose}
        /> 
</div>


);
}


}

export default EmailsListComponent;