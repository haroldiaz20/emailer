import React from 'react'
import Dropzone from 'react-dropzone';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import RaisedButton from 'material-ui/RaisedButton';

import config from '../config';

const styles = {
  root: {
    
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 500,
    minHeight: 150,
    overflowY: 'auto',
  },
};



class ProductsEditComponent extends React.Component{
	constructor(props){
		super(props);
		
		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handlePictureOnDrop = this.handlePictureOnDrop.bind(this);
		this.saveProduct = this.saveProduct.bind(this);
		this.handleAlertHide = this.handleAlertHide.bind(this);
		this.handleDeleteImageClick = this.handleDeleteImageClick.bind(this);
		this.handleCancelEditClick = this.handleCancelEditClick.bind(this);
		this.handleChangeStatuses = this.handleChangeStatuses.bind(this);
		this.state = {
			name: '',
			value: '',
			description: '',
			imagePath: '',
			picture: {},
			imageName: '',
			preview: '',
			isImagePreviewActive: true,
			isDropzoneActive: false,
			alert:{
				message: '',
				open: false
			}
		};
	}

	componentDidMount(){
		this.getProduct();
	}

	getProduct(){
		var url = config.apiRoot + '/mailer/api/products/' + this.props.params.value;

		return fetch(url).then((response) => {
	      	if(response.status===200){console.log('sucesuchsdjsldsds')}
	      	return response.json();
	      }).then((responseJson) => {

	      	if(responseJson.success===true){
	      		const imagePath = config.apiRoot + '/mailer/api/images/thumbs/500x500/' + responseJson.data.path;
	      		this.setState({name: responseJson.data.name, description: responseJson.data.description, 
	      		imagePath: imagePath, value: responseJson.data.value})
	
	      	}
	      	
	      })
	      .catch((error) => {
	        console.error(error);
	      });
	}

	handleDeleteImageClick(ev){
		this.handleChangeStatuses();				
	}

	handleCancelEditClick(ev){
		this.handleChangeStatuses();
	}

	handleChangeStatuses(){
		var newValueImgPreview,newValueDropZone;
		if(this.state.isImagePreviewActive===true){
			newValueImgPreview = false;
			newValueDropZone = true;
		}else{
			newValueDropZone = false;
			newValueImgPreview = true;
		}

		this.setState({isImagePreviewActive: newValueImgPreview, isDropzoneActive: newValueDropZone});
	}

	handleNameChange(ev){
		this.setState({
          name: ev.target.value,
        });
	}
	
	handleDescriptionChange(ev){
		this.setState({
          description: ev.target.value,
        });
	}
	
	handleAlertHide(){
		this.setState({alert: {message: '', open: false}});
	}

	handlePictureOnDrop(files) {
      	console.log('Received files: ', files);
     	
     	this.setState({
     		imageName: files[0].name,
     		preview: files[0].preview,
            picture: files[0],
        });
    }

	saveProduct(){
		console.log(this.state.picture);

		if(Object.keys(this.state.picture).length === 0 && this.state.isDropzoneActive===true){
			this.setState({alert:{
				message: 'You MUST select a picture for this product',
				open: true
			}});
			return;
		}
		
		var form = new FormData();
		// ASEGURARSE DE COLOCAR "CACHE CONTROL: NO CACHE" EN EL HEADER PORQUE SI LE OPNEMOS JSON NO ENVIARÁ EN ARCHIVO
		form.append("name", this.state.name);
		form.append("description", this.state.description);
		form.append("picture", this.state.picture);
		form.append("value", this.state.value);

		var token = localStorage.getItem("datatoken");
                var urlProducts = config.apiRoot + '/mailer/api/products';
		return fetch('/products/' + this.props.params.value, {
			  method: 'PUT',
			  "async": true,
  			  "crossDomain": true,
			  headers: {
			    "cache-control": "no-cache",
			    'x-access-token' : token,
			  },
			  "processData": false,
			  "contentType": false,
			  "mimeType": "multipart/form-data",
			  "body": form
			})
	      .then((response) => response.json())
	      .then((responseJson) => {
	        console.log(responseJson);
	        this.setState({alert: {message: responseJson.message, open:true}});
	      })
	      .catch((error) => {
	        console.log(error);
	      });

	}

	render() {

		
		return (
	    	
<div className="">
    <Card>			   
    <CardTitle title="Products" subtitle="Edit Product" />
    <CardText>
        <div>
            <TextField
                id="text-field-name"
                value={this.state.name}
                floatingLabelText="Name"
                fullWidth={true}
                onChange={this.handleNameChange}					     
                />
        </div>
        <div>
            <TextField
                id="text-field-description"
                value={this.state.description}
                floatingLabelText="Description"
                fullWidth={true}
                onChange={this.handleDescriptionChange}

                />
        </div>
        <h4>Image Preview</h4>
        <div className={this.state.isDropzoneActive === true ? 'dropZoneActive'
		    		: this.state.isDropzoneActive === false ? 'dropZoneHidden'
		    		: 'dropZoneHidden'}>
            <Dropzone ref={(node) => { this.dropzone = node; }} onDrop={this.handlePictureOnDrop}>
                <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
            <ul style={{'position': 'relative', 'top': -150}}>
                <li style={{"listStyle": "none"}}>
                    <img src={this.state.preview} width="100" alt={this.state.imageName}/>
                    <div>{this.state.imageName}</div>
                </li>
            </ul>			
        </div>
        <div className={this.state.isImagePreviewActive === true ? 'imagePreviewActive'
		    		: this.state.isImagePreviewActive === false ? 'imagePreviewHidden'
		    		: 'imagePreviewHidden'} style={styles.root}>

            <GridList
                cols={2}
                cellHeight={200}
                padding={1}
                style={styles.gridList}
                >

                <GridTile
                    key={this.state.value}
                    title={this.state.name}
                    actionPosition="left"
                    titlePosition="top"
                    titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
                    cols={2}
                    rows={1}
                    actionIcon={<IconButton tooltip="Click to CHANGE this image" 
					          touch={true} tooltipPosition="top-left" onTouchTap={this.handleDeleteImageClick} >
                    <ActionDelete color="white" /></IconButton>}
					        >
                    <img role="presentation" className="imgPreviewStyle" src={this.state.imagePath} />
                </GridTile>

            </GridList>
		    			
        </div>
    </CardText>
    <CardActions>
        <RaisedButton label="Save" onClick={this.saveProduct}/>
        <RaisedButton label="Cancel" onClick={this.handleCancelEditClick}/>
    </CardActions>
    </Card>	  
    <Snackbar
        open={this.state.alert.open}
        message={this.state.alert.message}
        autoHideDuration={4000}
        onRequestClose={this.handleAlertHide}
        />    			
</div>
	    );
}


}

export default ProductsEditComponent;