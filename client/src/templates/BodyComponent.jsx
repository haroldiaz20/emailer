import React, { Component } from 'react';
import ButtonComponent from './ButtonComponent.jsx';
import TextFieldComponent from './TextFieldComponent';

const style1 = {
	"padding": 40, "textAlign": "center", "fontFamily": "sans-serif", "fontSize": 15, "lineHeight": "20px", 
	"color": "#555555",
};

const style2 = {
	"borderRadius": 3, "background": "#222222", "textAlign": "center",
};


class BodyComponent extends Component {

    constructor(props){
        super(props);
        this._handleOnChangeText = this._handleOnChangeText.bind(this);
        
        this.state = {
            "textField": "Maecenas sed ante pellentesque, posuere leo id, eleifend dolor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent laoreet malesuada cursus.",
        };
    }

    _handleOnChangeText(value){
        this.setState({"textField": value});
    }

    render() {
        return (
        	<tr>
        	    <td  style={{"backgroundColor": "#ffffff"}}>
                    <table role="presentation" aria-hidden="true" cellSpacing="0" cellPadding="0" border="0" width="100%">
                        <tbody>
                            <tr>
                                <td style={style1}>
                                    <TextFieldComponent textField={this.state.textField} handleOnChangeText={this._handleOnChangeText}/>
                                    <br /><br />
                                    <table role="presentation" aria-hidden="true" cellSpacing="0" cellPadding="0" border="0" align="center" style={{"margin": "auto"}}>
                                    	<tbody>
                                        <tr>
                                            <td style={style2} className="button-td">
                                                <ButtonComponent titleBtn={this.props.titleBtn}/>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
            	</td>
        	</tr>

        );
    }

	
}

export default BodyComponent;
