
import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import ReactTable from 'react-table';

const customContentStyle = {
  width: '80%',
  maxWidth: 'none',
};


export default class DialogCampaignDetails extends React.Component {
  state = {
    open: false,
    title: '',
  };

  handleClose = () => {
    this.setState({open: false});
    this.props.handleDialogClose(false);
  };

  componentDidAmount(){
  	this.setState({open: this.props.dialogInit.open});
  	this.setState({title: this.props.dialogInit.title});
  }

  componentWillUpdate(){

  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      
    ];


    return (
      <div>
        <Dialog
          title={this.props.dialogInit.title}
          actions={actions}
          modal={false}
          contentStyle={customContentStyle}
          open={this.props.dialogInit.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
	          <ReactTable	          	
	            data={this.props.dataDialog}
	            columns={this.props.columnsDialog}
	            defaultPageSize={5}
	            showPagination={true}					          
	          />
        </Dialog>
      </div>
    );
  }
}