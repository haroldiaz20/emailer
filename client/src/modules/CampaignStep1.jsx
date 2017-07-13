import React from 'react'
import TextField from 'material-ui/TextField';



class CampaignStep1 extends React.Component{

	componentDidMount() {
		
	}
	
	constructor(props) {
		super(props);
		this.state = {campaign:{}, alert:{
				message: '',
				open: false
			}};
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleSubjectChange = this.handleSubjectChange.bind(this);
		this.handleFriendlyChange = this.handleFriendlyChange.bind(this);
	
	}
	
	handleNameChange(ev){
		var campaign = this.props.campaignSettings;
		campaign.name = ev.target.value;
		this.props.onCampaignChange(campaign);
	}

	handleDescriptionChange(ev){
		var campaign = this.props.campaignSettings;
		campaign.description = ev.target.value;
		this.props.onCampaignChange(campaign);
	}

	handleSubjectChange(ev){
		var campaign = this.props.campaignSettings;
		campaign.subject = ev.target.value;
		this.props.onCampaignChange(campaign);
	}
	handleFriendlyChange(ev){
		var campaign = this.props.campaignSettings;
		campaign.friendly = ev.target.value;
		this.props.onCampaignChange(campaign);
	}

	saveCampaign(){
		alert('hola');
	}

	render() {
	    return (    	
	      <div>
		        <p>Select campaign settings. Campaign settings include: campaign name, subject, friendly from, etc...</p>
	      		<div>
	      		<TextField
		    		  id="text-field-campaign-name"
				      value={this.props.campaignSettings.name}
				      floatingLabelText="Name"
				      fullWidth={true}
				      onChange={this.handleNameChange}
				/>
				</div>
				<div><TextField
				      id="text-field-campaign-description"
				      value={this.props.campaignSettings.description}
				      floatingLabelText="Description"
				      fullWidth={true}
				      onChange={this.handleDescriptionChange}
				/></div>			       
		        <div><TextField
		        	  id="text-field-campaign-subject"
				      value={this.props.campaignSettings.subject}
				      floatingLabelText="Subject"
				      fullWidth={true}
				      onChange={this.handleSubjectChange}
				/></div>
				<div><TextField
					  id="text-field-campaign-friendly-from"
				      value={this.props.campaignSettings.friendly}
				      floatingLabelText="Friendly From"
				      fullWidth={true}
				      onChange={this.handleFriendlyChange}
				/>
				</div>
	      </div>
	      	 		
	      
	    );
	  }
	

}

export default CampaignStep1;