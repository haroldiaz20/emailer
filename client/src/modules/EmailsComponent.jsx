import React from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';

class EmailsComponent extends React.Component{


	render() {
	    return (
			<Grid fluid style={{"marginTop": 30}}>
				<Row>
	          		<Col xs={12} md={8} mdOffset={3}>
	      				 {this.props.children}		
	      			</Col>
	      		</Row>
	      	</Grid>
	    );
	}

	componentDidAmount(){
		
	}
	

}

export default EmailsComponent;