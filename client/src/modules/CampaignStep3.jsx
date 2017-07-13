import React from 'react'
import Divider from 'material-ui/Divider';
import {Table, TableBody, TableRow, TableRowColumn} from 'material-ui/Table';

var CodeMirror = require('react-codemirror');
require('codemirror/lib/codemirror.css');
require('codemirror/mode/htmlembedded/htmlembedded');


class CampaignStep3 extends React.Component{

	
	constructor(props) {
		super(props);
		this.state = {campaign:{}, value: 0,code: '', codePreview: '', delay: 0, alert:{
				message: '', variables: [],
				open: false
			}};
		this.handleBodyChange = this.handleBodyChange.bind(this);
		this.updateCode = this.updateCode.bind(this);
		this.updatePreview = this.updatePreview.bind(this);
	}

	updateCode(newCode){

		this.setState({
            code: newCode,
        });
       
       	// pass property to parent object
		var campaign = this.props.campaignSettings;
		campaign.body = this.state.code;
		this.props.onCampaignChange(campaign);

		// Update preview on iframe
        clearTimeout(this.state.delay);
        this.setState({codePreview: this.state.code});
        var newDelay = setTimeout(this.updatePreview, 300);
        this.setState({delay: newDelay});
	}

	updatePreview(){
		//var newCode = this.state.code;
		var codeFinal= this.state.codePreview;
		this.props.arrayVariables.map((item) => (
			 codeFinal = codeFinal.replace(item.img_product, item.url)
		));

		var previewFrame = document.getElementById('preview');
        var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
        preview.open();
        preview.write(codeFinal);
        preview.close();
        this.setState({codePreview: codeFinal});
        
	}

	componentDidMount() {
		//this.setState({variables: this.props.arrayVariables});
		//console.log(this.props.imagesArray);
		//console.log('estas son las variables');
		//console.log(this.props.arrayVariables);
		this.updatePreview();
	}

	
	handleBodyChange(ev){
		var campaign = this.props.campaignSettings;
		campaign.body = ev.target.value;
		this.props.onCampaignChange(campaign);
	}

	render() {
		var options = {
            lineNumbers: true,
        };

	    return (
	    	<div className="step3__campaign--wrapper">
	    		<p>
	    			Create your campaign's template including your images and your links...
	    		</p>
	    		
    	<Table selectable={false}
          multiSelectable={false}>    
		    <TableBody displayRowCheckbox={false}>		  
		      <TableRow><TableRowColumn>{'{{open}}'}</TableRowColumn></TableRow>
		      	{this.props.arrayVariables.map((item) => (
		      		<TableRow>
		      			<TableRowColumn>{item.link_product}</TableRowColumn>
		      			<TableRowColumn>{item.img_product}</TableRowColumn> 
		      		</TableRow>
		      	))};
		      </TableBody>
        </Table>
        <Divider />

			    <CodeMirror value={this.props.campaignSettings.body} onChange={this.updateCode} options={options} />
			    <Divider />
			    <iframe id="preview" style={{"minHeight": 500, "width": "100%"}}></iframe>
	    	</div>
	      	 		
	      
	    );
	  }
	

}

export default CampaignStep3;