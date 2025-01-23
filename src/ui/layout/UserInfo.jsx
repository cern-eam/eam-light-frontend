import React from "react";
import { Account, Logout } from "mdi-material-ui";
import { IconButton } from "@mui/material";
import { logout } from "../../AuthWrapper";
import useUserDataStore from "../../state/useUserDataStore";
import useInforContextStore from "../../state/useInforContext";
import useScannedUserStore from "../../state/useScannedUserStore";

const UserInfo = () => {
  const { userData, cleanUserData } = useUserDataStore();
  const { setInforContext } = useInforContextStore();
  const { scannedUser, setScannedUser } = useScannedUserStore();

  const userInfoStyle = {
    color: "rgba(255, 255, 255, 0.8)",
    flexGrow: 1,
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  };

  const accountIcon = {
    fontSize: 20,
    margin: 5,
  };

  const logoutIcon = {
    color: "rgba(255, 255, 255, 0.8)",
    paddingRight: 9,
    fontSize: 18,
    lineHeight: "22px",
  };

  const separatorStyle = {
    borderLeft: "1px solid rgba(255, 255, 255, 0.8)",
    width: 1,
    height: 22,
    marginLeft: 14,
  };

  const logoutHandler = () => {
    if (scannedUser) {
      setScannedUser(null);
      return;
    }
    if (import.meta.env.VITE_LOGIN_METHOD === "STD") {
      window.localStorage.setItem("inforContext", null);
      sessionStorage.setItem("inforContext", null);
      setInforContext(null);
      cleanUserData();
    }
    logout();
  };

  const usernameDisplay =
    userData.eamAccount.userCode +
    (scannedUser ? ` (${scannedUser.userCode})` : "");

  return (
    <div style={userInfoStyle}>
      <Account style={accountIcon} />
      <span className="user-name">{usernameDisplay}</span>
      <span style={separatorStyle} />
      <IconButton onClick={logoutHandler} style={logoutIcon} size="large">
        <Logout style={{ fontSize: 20 }} />
      </IconButton>
    </div>
  );
};

export default UserInfo;
