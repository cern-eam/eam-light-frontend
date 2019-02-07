import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

export default class ConfirmationDialog extends Component {
    state = {
        open: false,
    };

    show() {
        this.setState({
            open: true
        })
    }

    handleClose = (confirm) => {
        if (confirm === true) {
            this.props.onConfirm()
        }
        this.setState({open: false});
    };

    render() {
        return (
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}>
                <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{this.props.content}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.handleClose(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => this.handleClose(true)} color="primary" autoFocus>
                        {this.props.confirmButtonText || 'Yes'}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}