import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import BlockUi from 'react-block-ui';

/**
 * Receive as props:
 * isOpen: Indicator of dialog open
 * title: Title to display
 * message: Confirm message
 * cancelHandler: Cancel Handler
 * confirmHandler: Action to be executed in the confirm
 * cancelButtonLabel: Label for the button cancel
 * confirmButtonLabel: Label for the button confirm
 */
const EAMConfirmDialog = (props) => (
    <Dialog
        open={props.isOpen}
        onClose={props.cancelHandler}>
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
            <BlockUi tag="div" blocking={props.blocking}>
                <DialogContentText id="alert-dialog-description">
                    {props.message}
                </DialogContentText>
            </BlockUi>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.cancelHandler} color="primary" disabled={props.blocking}>
                {props.cancelButtonLabel}
            </Button>
            <Button onClick={props.confirmHandler} color="primary" autoFocus disabled={props.blocking}>
                {props.confirmButtonLabel}
            </Button>
        </DialogActions>
    </Dialog>
);

EAMConfirmDialog.defaultProps = {
    cancelButtonLabel: 'Cancel',
    confirmButtonLabel: 'Confirm',
    blocking: false,
};

export default EAMConfirmDialog;