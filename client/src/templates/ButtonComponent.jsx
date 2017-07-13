import React, { Component } from 'react';

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

const style3 = {
  "background": "#222222", "border": "15px solid #222222", "fontFamily": "sans-serif", "fontSize": 13, "lineHeight": "1.1", "textAlign": "center", "textDecoration": "none", "display": "block", "borderRadius": 3, "fontWeight": "bold",
};


class ButtonComponent extends Component {

  constructor(props){
    super(props);
    this._handleButtonClick = this._handleButtonClick.bind(this);
  }

  _handleButtonClick(event){
    event.preventDefault();
    
  }

  render() {
    return (
          <a onClick={this._handleButtonClick}  href="#" style={style3} className="button-a">
            <span style={{"color":"#ffffff"}} className="button-link">&nbsp;&nbsp;&nbsp;&nbsp;{this.props.titleBtn}&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </a>
            
    );
  }
}



export default ButtonComponent;