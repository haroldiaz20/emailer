import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


const customContentStyle = {
  width: '50%',
  maxWidth: 'none',
};

/**
 * The dialog width has been set to occupy the full width of browser through the `contentStyle` property.
 */
export default class DialogConfirmComponent extends React.Component {
    state = {
      open: false,
    };

    handleOpen = () => {
      //this.setState({open: true});
      this.props.handleDialogOpen(true);

    };

    handleClose = () => {
      //this.setState({open: false});
      this.props.handleDialogClose(false);
    };

    handleConfirm = () =>{
      this.props.callbackFunction();
    };

    componentDidMount = () =>{
      //this.setState({open: this.props.isOpened});
    };

    render() {
      const actions = [
        <FlatButton
          label="No, I'm not"
          primary={false}
          onTouchTap={this.handleClose}
        />,
        <FlatButton
          label="Yes, I am"
          primary={true}
          onTouchTap={this.handleConfirm}
        />,
      ];

      return (
        <div>
         
          <Dialog
            title={this.props.dialogTitle}
            actions={actions}
            modal={true}
            contentStyle={customContentStyle}
            open={this.props.isOpened}
          >
            {this.props.dialogMessage}
          </Dialog>
        </div>
      );
    }
}