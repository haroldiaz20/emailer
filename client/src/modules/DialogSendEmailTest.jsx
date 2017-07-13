import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

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
      this.props.handleDialogCancel(false);
    };

    handleConfirm = () =>{
      this.props.handleDialogAccept();
    };

    componentDidMount = () =>{
      //this.setState({open: this.props.isOpened});
    };

    _handleEmailChangeTest(event){
      var correo = event.target.value;
      this.props.handleEmailChange(correo);

    }

    _handleMessageChangeTest(event){
        var mensaje = event.target.value;
        this.props.handleMessageChange(mensaje);
    }

    render() {
      const actions = [
        <FlatButton
          label="No, don't send it"
          primary={false}
          onTouchTap={this.handleClose}
        />,
        <FlatButton
          label="Yes, send it"
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
            <div>
                <TextField
                      id="text-field-emailtest-email"
                      value={this.props.emailTest}
                      floatingLabelText="Email Address"
                      fullWidth={true}
                      onChange={this._handleEmailChangeTest.bind(this)}
                />
            </div>
            <div>
                <TextField
                      id="text-field-emailtest-message"
                      value={this.props.messageTest}
                      floatingLabelText="Message"
                      fullWidth={true}
                      multiLine={true}
                      rows={2}
                      rowsMax={4}
                      onChange={this._handleMessageChangeTest.bind(this)}
                />
            </div>
          </Dialog>
        </div>
      );
    }
}