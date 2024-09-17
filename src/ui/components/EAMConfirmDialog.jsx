import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import BlockUi from "react-block-ui";

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
  <Dialog open={props.isOpen} onClose={props.cancelHandler}>
    <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
    <DialogContent>
      <BlockUi tag="div" blocking={props.blocking}>
        <DialogContentText id="alert-dialog-description">
          {props.message}
        </DialogContentText>
      </BlockUi>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={props.cancelHandler}
        color="primary"
        disabled={props.blocking}
      >
        {props.cancelButtonLabel}
      </Button>
      <Button
        onClick={props.confirmHandler}
        color="primary"
        autoFocus
        disabled={props.blocking}
      >
        {props.confirmButtonLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

EAMConfirmDialog.defaultProps = {
  cancelButtonLabel: "Cancel",
  confirmButtonLabel: "Confirm",
  blocking: false,
};

export default EAMConfirmDialog;
