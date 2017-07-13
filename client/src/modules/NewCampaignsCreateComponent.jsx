
import React from 'react'
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';

import Snackbar from 'material-ui/Snackbar';
import { Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';

import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import EmailListComponent from './EmailListComponent';

import {
EditorState,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import EditorComponent from '../templates/EditorComponent';


import config from '../config';

const style = {
    marginLeft: 20,
};

const rawContentState = {"entityMap": {}, "blocks": [{"key": "3q6ro", "text": "testing", "type": "header-six", "depth": 0, "inlineStyleRanges": [{"offset": 0, "length": 7, "style": "fontsize-24"}, {"offset": 0, "length": 7, "style": "fontfamily-Times New Roman"}, {"offset": 0, "length": 7, "style": "color-rgb(209,72,65)"}], "entityRanges": [], "data": {}}]};

class NewCampaignsCreateComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            subject: '',
            friendly: '',
            images: [],
            lists: [],
            alert: {
                message: '',
                open: false
            },
            editorContents: [],
            contentState: rawContentState,
            editorState: EditorState.createEmpty(),
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleSubjectChange = this.handleSubjectChange.bind(this);
        this.handleFriendlyChange = this.handleFriendlyChange.bind(this);
        this.handleProductOnCheck = this.handleProductOnCheck.bind(this);
        this._handleImagesListChange = this._handleImagesListChange.bind(this);
        this._handleSaveCampaign = this._handleSaveCampaign.bind(this);
        this._handleEditorStateChange = this._handleEditorStateChange.bind(this);
        this._handleEditorContentChange = this._handleEditorContentChange.bind(this);

        // Lists
        this._handleListsUnselect = this._handleListsUnselect.bind(this);
        this._handleListsSelect = this._handleListsSelect.bind(this);
        this._handleUploadImagesEditor = this._handleUploadImagesEditor.bind(this);
        this.handleAlertHide = this.handleAlertHide.bind(this);
    }

    handleProductOnCheck(ev, isChecked) {
        ev.target.value = isChecked;
        console.log(this.ifr);
    }

    handleNameChange(ev) {
        this.setState({
            name: ev.target.value,
        });
    }

    handleDescriptionChange(ev) {
        this.setState({
            description: ev.target.value
        });
    }

    handleSubjectChange(ev) {
        this.setState({
            subject: ev.target.value
        });
    }

    handleFriendlyChange(ev) {
        this.setState({
            friendly: ev.target.value
        });
    }

    _handleImagesListChange(newList) {
        this.setState({
            images: newList
        });
    }

    // START LISTS HANDLE
    _handleListsUnselect(lists) {
        this.setState({
            lists: lists
        });
    }

    _handleListsSelect(lists) {
        this.setState({
            lists: lists
        });
    }

    // END LISTS HANDLE

    _handleEditorStateChange(newStateContent) {
        this.setState({
            editorState: newStateContent
        });
    }

    _handleEditorContentChange(newEditorContent) {

        this.setState({
            editorContent: newEditorContent
        });
        setTimeout(() => {
            var newImagesArray = [];

            const hashConfig = {
                trigger: '#',
                separator: ' ',
            };

            var editor = draftToHtml(this.state.editorContent, hashConfig, true);

            for (var i = 0, len = this.state.images.length; i < len; i++) {
                var codigo = this.state.images[i];

                var indice = editor.indexOf(codigo);
                if (indice > -1) {
                    newImagesArray.push(codigo);
                }
            }
            this.setState({"images": newImagesArray});
        }, 400);
    }

    _handleImagesUpload(codigo) {
        var imagesArray = this.state.images;

        var index = imagesArray.indexOf(codigo);

        if (index < 0) {
            imagesArray.push(codigo);
        }
    }
    handleAlertHide() {
        this.setState({alert: {message: '', open: false}});
    }

    _handleSaveCampaign(ev) {
        ev.preventDefault();

        if (this.state.name === '' || this.state.name === null) {
            this.setState({alert: {message: 'Debe asignar un nombre a esta campaña.', open: true}});
            return;
        }
        if (this.state.subject === '' || this.state.subject === null) {
            this.setState({alert: {message: 'Debe asignar un "subject" a esta campaña.', open: true}});
            return;
        }
        if (this.state.friendly === '' || this.state.friendly === null) {
            this.setState({alert: {message: 'Debe asignar un "friendly from" a esta campaña.', open: true}});
            return;
        }
        if (this.state.lists.length < 0) {
            this.setState({alert: {message: 'Debe escoger por lo menos una lista de emails para enviar esta campaña.', open: true}});
            return;
        }

        const hashConfig = {
            trigger: '#',
            separator: ' '
        };

        const markup = draftToHtml(this.state.editorContent, hashConfig, true);
        console.log(markup);
        var token = localStorage.getItem("datatoken");

        var urlFetch = config.apiRoot + '/mailer/api/campaign/create-campaign';
        return fetch(urlFetch, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify({
                name: this.state.name,
                subject: this.state.subject,
                friendly: this.state.friendly,
                desc: this.state.description,
                body: markup,
                lists: this.state.lists,
                images: this.state.images,
            })
        }).then((response) => response.json()).then((responseJson) => {
            console.log(responseJson);
            if (responseJson.success === true || responseJson.success === 1) {
                this.setState({alert: {message: responseJson.message, open: true}});
            } else {
                var mens = 'No se pudo guardar la campaña. Inténtelo nuevamente en un momento.';
                this.setState({alert: {message: mens, open: true}});
                console.log('no se pudo guardar la campaña :(');
            }

        }).catch((error) => {
            console.log(error);
        });

    }

    _handleUploadImagesEditor(file) {
        var token = localStorage.getItem("datatoken");
        const data = new FormData(); // eslint-disable-line no-undef
        data.append('picture', file);

        var urlFetch = config.apiRoot + '/mailer/api/products/upload';

        // se debe retornar una promesa
        return fetch(urlFetch, {
            "method": 'POST',
            "async": true,
            "crossDomain": true,
            headers: {
                "cache-control": "no-cache",
                'x-access-token': token
            },
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "body": data
        }).then((response) => response.json()).then((responseJson) => {

            if (responseJson.success === true || responseJson.success === 1) {
                this._handleImagesUpload(responseJson.data.value);
                const urlFinal = config.apiRoot + '/mailer/api/images/' + responseJson.data.path;

                return urlFinal;
            } else {
                return '';
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    render() {

        return(
                <Row>
                    <Col xs={12} md={12} sm={12}>
                    <Card>
                    <CardTitle title="Campaigns" subtitle="Create your campaign" />
                    <CardText>
                        <Paper zDepth={2}>
                            <TextField hintText="Input your Campaign name"  style={style} underlineShow={false}  fullWidth={true} onChange={this.handleNameChange}/>
                            <Divider />
                            <TextField hintText="Input your Campaign description"  style={style} underlineShow={false}  fullWidth={true} onChange={this.handleDescriptionChange}/>
                            <Divider />
                            <TextField hintText="Input your subject"  style={style} underlineShow={false}  fullWidth={true} onChange={this.handleSubjectChange}/>
                            <Divider />
                            <TextField hintText="Input your Friendly from address"  style={style} underlineShow={false}  fullWidth={true} onChange={this.handleFriendlyChange}/>
                            <Divider />
                        </Paper>
                        <Paper zDepth={2}>
                            <EmailListComponent style={style} arraylists={this.state.lists} onListSelect={this._handleListsSelect} onListUnselect={this._handleListsUnselect}/>
                        </Paper>
                        <br />
                        <Paper zDepth={2}>
                
                            <EditorComponent 
                                editorStateP={this.state.editorState}
                                editorContentP={this.state.editorContents}
                                contentStateP={this.state.contentState}
                                onHandleEditorContent={this._handleEditorContentChange}
                                onHandleEditorState={this._handleEditorStateChange} 
                                onImagesUpload={this._handleUploadImagesEditor}
                
                                />
                        </Paper>
                
                    </CardText>
                    <CardActions>
                        <RaisedButton label="Save" primary={true} onClick={this._handleSaveCampaign}/>
                        <RaisedButton label="Cancel" />
                    </CardActions>
                    </Card> 
                    </Col>
                    <Snackbar
                        open={this.state.alert.open}
                        message={this.state.alert.message}
                        autoHideDuration={4000}	
                        onRequestClose={this.handleAlertHide}
                        />   
                </Row>


                );
    }

}

export default NewCampaignsCreateComponent;