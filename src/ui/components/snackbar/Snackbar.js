import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import './Snackbar.css';

/**
 * Display a success or error message
 */
export default class ACE2Snackbar extends React.Component {

  render() {
    return (
      <Snackbar
          style={{whiteSpace: "pre-line"}}
        className={"snackbar " + this.props.type}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={this.props.open}
        autoHideDuration={4000}
        onClose={this.props.onClose}
        message={
          <div>
            <div><b>{this.props.title}</b></div>
            <div>{this.props.message}</div>
          </div>
        }
      />
    );
  }

}