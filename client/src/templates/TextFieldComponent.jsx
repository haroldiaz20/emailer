import React, { Component } from 'react';
import BodyComponent from './BodyComponent';

import TextField from 'material-ui/TextField';

const styleImg = {
  "width": "100%",
  "maxWidth": 680,
  "height": "auto",
  "background": "#dddddd",
  "fontFamily": "sans-serif",
  "fontSize": 15,
  "lineHeight": "20px",
  "color": "#555555", 
};

class TextFieldComponent extends Component {

  constructor(props){
    super(props);
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.state = {
        textField: '',
    };
  }

  handleChangeInput(event, value){
   
    this.props.handleOnChangeText(value);
  }

  render() {
    return (
        <div>
              {this.props.textField} <br />
                <TextField
                  hintText="ssss"
                  floatingLabelText="sss"
                  value={this.props.textField}
                  multiLine={true}
                  fullWidth={true}
                  onChange={this.handleChangeInput}
                  rows={2}
                />
        </div>            
    );
  }

}



export default TextFieldComponent;
