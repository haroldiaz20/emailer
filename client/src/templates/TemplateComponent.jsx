import React, { Component } from 'react';
import BodyComponent from './BodyComponent';
import IconButton from 'material-ui/IconButton';
import FileFileUpload from 'material-ui/svg-icons/file/file-upload';
import FlatButton from 'material-ui/FlatButton';
import Dropzone from 'react-dropzone';


const styleImg = {
  "width": "100%",
  "maxWidth": 680,
  "maxHeight": 300,
  "background": "#dddddd",
  "fontFamily": "sans-serif",
  "fontSize": 15,
  "lineHeight": "20px",
  "color": "#555555", 
};

const styles = {
  uploadButton: {
    verticalAlign: 'middle',
  },
  uploadInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
};


class TemplateComponent extends Component {

  constructor(props){
    super(props);
   
    this._onOpenClick = this._onOpenClick.bind(this);
    this._onDrop = this._onDrop.bind(this);

    this.state = {
        titleButton: 'A Button',
        files: [],
        images: [
        	{
        		'src': 'http://placehold.it/1360x600',
            'name': '',
            'desc': '',
            'picture': '',
        	}
        ],
        inputs: [],
    };
  }



	_onOpenClick(ev) {
      this.dropzone.open();
    }

  _onDrop(acceptedFiles) {
    	var images = this.state.images;
    	images[0].src = acceptedFiles[0].preview;
    	images[0].picture = acceptedFiles,
      
      this.setState({
        files: acceptedFiles,
        images: images,
      });
      console.log('template images');
      console.log(images);
      this.props.handleImagesListChange(images);
  }


	render() {
		return (
	        <table role="presentation" aria-hidden="true" cellSpacing="0" cellPadding="0" border="0" align="center" width="100%" style={{"maxWidth" : 680}}>
	          <tbody>
	                <tr>
	                  	<td style={{"backgroundColor": "#ffffff"}}>
	                        
	                        <img src={this.state.images[0].src} aria-hidden="true" width="" height="300" alt="alt_text" border="0" align="center" className="fluid" style={styleImg} className="g-img" />
	                        <Dropzone style={{"visibility": "hidden", "height": 0}} ref={(node) => { this.dropzone = node; }} onDrop={this._onDrop}>
			                    <div></div>
			                </Dropzone>
	                        <FlatButton
      label="Choose an Image"
      labelPosition="before"
      style={styles.uploadButton}
      containerElement="label"
      onClick={this._onOpenClick}
    >
    </FlatButton>
	                    </td>
	                </tr>                    
	                <BodyComponent titleBtn={this.state.titleButton}/>
	          </tbody>        
	            
	        </table>
		        
		);
  }

}



export default TemplateComponent;
