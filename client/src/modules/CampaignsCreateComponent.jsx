
import React from 'react'
import {Card} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Snackbar from 'material-ui/Snackbar';
import CampaignStep from './CampaignStep.jsx';

class CampaignsCreateComponent extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {
			name: "harold",
			campaign:{},
			alert:{
				message: '',
				open: false
			}
		};
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleSubjectChange = this.handleSubjectChange.bind(this);
		this.handleFriendlyChange = this.handleFriendlyChange.bind(this);

	}
	
	handleNameChange(ev){
		this.setState({
			campaign:{
				name: ev.target.value
			}
		});
	}

	handleDescriptionChange(ev){
		this.setState({
			campaign:{
				description: ev.target.value
			}
		});
	}

	handleSubjectChange(ev){
		this.setState({
			campaign:{
				subject: ev.target.value
			}
		});
	}
	handleFriendlyChange(ev){
		this.setState({
			campaign:{
				friendly: ev.target.value
			}
		});
	}

	saveCampaign(){
		alert('hola');
	}

	render(){
	
		return(
			<div className="create-campaign-component">

			<Card>				
				<CampaignStep />
			</Card>  
			<Divider/>				

			<Snackbar
	          open={this.state.alert.open}
	          message={this.state.alert.message}
	          autoHideDuration={4000}
	         
	        />    

				 {this.props.children}		
			</div>
		);
	}
	

}

export default CampaignsCreateComponent;