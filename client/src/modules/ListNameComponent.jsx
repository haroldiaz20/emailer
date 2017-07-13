import React from 'react'
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ContentSave from 'material-ui/svg-icons/content/save';

const iconStyle = {
	float: 'right',
	position: 'relative',
	right: 0,
	top: -50,
	width: '20%'
};


class ListNameComponent extends React.Component{

	constructor(props){
		super(props);

		 this.state = {
		  isActive: false,
		  isLabelActive: true,
	      valueInput: '',
	    };
	}


	componentWillMount = () => {
		this.setState({valueInput: this.props.nameList,});
	};

	handleChangeInput = (event) =>{
		this.setState({valueInput: event.target.value,});
	};

	handleBlurInput = (event) =>{
		var newLabelActive, newActive;
		if(this.state.isLabelActive === true){
				newLabelActive = false;
				newActive = true;
				
		}else{
			newLabelActive = true;
			newActive = false;
			
		}

		this.setState({isActive: newActive, isLabelActive: newLabelActive,});
		this.props.onChangeValue(this.state.valueInput);
	};

	handleClickInput = (event) =>{
		var newActive, newLabelActive;
		if(this.state.isActive === true){
				newActive = false;
				newLabelActive = true;
		}else{
			newActive = true;
			newLabelActive = false;
		}

		this.setState({isActive: newActive,isLabelActive: newLabelActive,});
	};

	render() {
	    return (	    	
	      	<div>
		    		<span onClick={this.handleClickInput} className={this.state.isLabelActive === true ? 'inputActive'
		    		: this.state.isLabelActive === false ? 'inputHidden'
		    		: 'inputHidden'}>{this.state.valueInput}</span>
		    		<span className={this.state.isActive === true ? 'inputActive'
		    		: this.state.isActive === false ? 'inputHidden'
		    		: 'inputHidden'}><TextField
		    			style={{width: '80%'}}
			          id="text-field-controlled"
			          value={this.state.valueInput}
			          onChange={this.handleChangeInput}
			          onBlur={this.handleBlurInput}
			        /><IconButton style={iconStyle}><ContentSave /></IconButton></span>
		    	</div>
	      
	    );
	}	

}

export default ListNameComponent;