import React, { Component } from "react";
import { Account, Logout } from "mdi-material-ui";
import { IconButton } from "@mui/material";
import { logout } from "../../AuthWrapper";

export default class UserInfo extends Component {
  userInfoStyle = {
    color: "rgba(255, 255, 255, 0.8)",
    flexGrow: 1,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  };

  accountIcon = {
    fontSize: 20,
    margin: 5,
  };

  logoutIcon = {
    color: "rgba(255, 255, 255, 0.8)",
    paddingRight: 9,
    fontSize: 18,
    lineHeight: "22px",
  };

  separatorStyle = {
    borderLeft: "1px solid rgba(255, 255, 255, 0.8)",
    width: 1,
    height: 22,
    marginLeft: 14,
  };

  logoutHandler() {
    if (this.props.scannedUser) {
      this.props.updateScannedUser(null);
      return;
    }
    if (import.meta.env.VITE_LOGIN_METHOD === "STD") {
      this.props.updateInforContext(null);
      this.props.updateApplication({ userData: null });
      sessionStorage.removeItem("inforContext");
    }
    logout();
  }

  render() {
    const { scannedUser } = this.props;

    const usernameDisplay =
      this.props.userData.eamAccount.userCode +
      (scannedUser ? ` (${scannedUser.userCode})` : "");

    return (
      <div style={this.userInfoStyle}>
        <Account style={this.accountIcon} />
        <span className="user-name">{usernameDisplay}</span>
        <span style={this.separatorStyle} />
        <IconButton
          onClick={this.logoutHandler.bind(this)}
          style={this.logoutIcon}
          size="large"
        >
          <Logout style={{ fontSize: 20 }} />
        </IconButton>
      </div>
    );
  }
}
