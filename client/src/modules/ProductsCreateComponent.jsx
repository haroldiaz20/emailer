import React from 'react'
import Dropzone from 'react-dropzone';
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';

import config from '../config';

class ProductsCreateComponent extends React.Component {

    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePictureOnDrop = this.handlePictureOnDrop.bind(this);
        this.saveProduct = this.saveProduct.bind(this);
        this.handleAlertHide = this.handleAlertHide.bind(this);
        this.state = {
            name: '',
            description: '',
            picture: {},
            imageName: '',
            preview: '',
            alert: {
                message: '',
                open: false
            }
        };
    }

    handleNameChange(ev) {
        this.setState({
            name: ev.target.value,
        });
    }

    handleDescriptionChange(ev) {
        this.setState({
            description: ev.target.value,
        });
    }

    handleAlertHide() {
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

    saveProduct() {

        var form = new FormData();
        // ASEGURARSE DE COLOCAR "CACHE CONTROL: NO CACHE" EN EL HEADER PORQUE SI LE OPNEMOS JSON NO ENVIARÁ EN ARCHIVO
        form.append("name", this.state.name);
        form.append("description", this.state.description);
        form.append("picture", this.state.picture);

        var token = localStorage.getItem("datatoken");
        var urlProducts = config.apiRoot + '/mailer/api/products/create';
        
        return fetch(urlProducts, {
            method: 'POST',
            "async": true,
            "crossDomain": true,
            headers: {
                "cache-control": "no-cache",
                'x-access-token': token,
            },
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "body": form
        })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log(responseJson);
                    this.setState({alert: {message: responseJson.message, open: true}});
                })
                .catch((error) => {
                    console.log(error);
                });

    }

    render() {


        return (
                <div className="">
                    <Card>			   
                    <CardTitle title="Products" subtitle="Create Product" />
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
                        <div>
                            <Dropzone ref={(node) => {
                        this.dropzone = node;
                    }} onDrop={this.handlePictureOnDrop}>
                                <div>Try dropping some files here, or click to select files to upload.</div>
                            </Dropzone>
                            <ul style={{'position': 'relative', 'top': -150}}>
                                <li style={{"listStyle": "none"}}>
                                    <img src={this.state.preview} width="100" alt={this.state.imageName}/>
                                    <div>{this.state.imageName}</div>
                                </li>
                            </ul>
                
                        </div>
                    </CardText>
                    <CardActions>
                        <RaisedButton label="Save" onClick={this.saveProduct}/>
                        <RaisedButton label="Cancel" />
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

export default ProductsCreateComponent;