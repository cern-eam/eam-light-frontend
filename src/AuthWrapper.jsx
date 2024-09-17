import * as React from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { LinearProgress } from "@mui/material";
import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENTID,
});

let tokens;

const handleTokens = (freshTokens) => {
  tokens = freshTokens;
};

export default (props) => {
  switch (import.meta.env.VITE_LOGIN_METHOD) {
    case "OPENID":
      console.log("Using OpenID");
      return (
        <ReactKeycloakProvider
          authClient={keycloak}
          onTokens={handleTokens}
          initOptions={{ onLoad: "login-required" }}
          LoadingComponent={<LinearProgress />}
        >
          {props.children}
        </ReactKeycloakProvider>
      );
    case "CERNSSO":
    case "LOCAL":
    case "STD":
      return props.children;
    default:
      return <div>No authentication flow declared.</div>;
  }
};

const logout = () => {
  switch (import.meta.env.VITE_LOGIN_METHOD) {
    case "OPENID":
      keycloak.logout();
      break;
    case "CERNSSO":
      window.location.href =
        "https://espace.cern.ch/authentication/_layouts/15/SignOut.aspx";
      break;
    case "LOCAL":
      alert(`LOCAL development: logout just shows this alert.`);
      break;
    default:
      break;
  }
};

export { tokens, keycloak, logout };
