import React from "react";
import Snackbar from "@mui/material/Snackbar";
import "./Snackbar.css";
import useSnackbarStore from "../../../state/useSnackbarStore";

/**
 * Display a success or error message
 */
const SnackbarLight = () => {
  const {snackbarData: { type, open, autoHideDuration, title, message }, hideNotification} = useSnackbarStore(); 

  return (
    <Snackbar
      style={{ whiteSpace: "pre-line" }}
      className={`snackbar ${type}`}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={open}
      autoHideDuration={4000}
      onClose={hideNotification}
      message={
        <div>
          <div>
            <b>{title}</b>
          </div>
          <div>{message}</div>
        </div>
      }
    />
  );
};

export default SnackbarLight;
