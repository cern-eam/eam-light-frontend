import React from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { LinearProgress } from '@mui/material';
import Keycloak from "keycloak-js";
import axios from "axios";

const keycloak = new Keycloak({
    url: process.env.REACT_APP_KEYCLOAK_URL,
    realm: process.env.REACT_APP_KEYCLOAK_REALM,
    clientId: process.env.REACT_APP_KEYCLOAK_CLIENTID,
});

const keycloakAxios = axios.create({
    baseURL: `${process.env.REACT_APP_KEYCLOAK_URL}/realms/${process.env.REACT_APP_KEYCLOAK_REALM}`,
});

let tokens = {};

const handleTokens = (key, freshTokens) => {
    console.log(key, freshTokens)
    tokens[key] = freshTokens;
};

export default (props) => {
    switch (process.env.REACT_APP_LOGIN_METHOD) {
        case "OPENID":
            console.log("Using OpenID");
            return (
                <ReactKeycloakProvider
                    authClient={keycloak}
                    onTokens={token => handleTokens(process.env.REACT_APP_KEYCLOAK_CLIENTID, token)}
                    initOptions={{ onLoad: "login-required" }}
                    LoadingComponent={<LinearProgress/>}
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

const injectBearerToken = ({ config, clientID }) => {
    const newConfig = config;
    const clientTokens = tokens[clientID];
    if (!clientTokens) return newConfig;
    const token = clientTokens.token || clientTokens.access_token;
    if (!token) return newConfig;
    newConfig.headers.Authorization = `Bearer ${token}`;
    return newConfig;
};

const exchangeToken = async ({ sourceClient, targetClient }) => {
    console.log("EXCHANGE TOKEN")
    if(!tokens[sourceClient]) return null;
    if(tokens[targetClient]) return tokens[targetClient];

    const formData = {
        client_id: sourceClient,
        subject_token: tokens[sourceClient].token,
        audience: targetClient,
        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
        request_type: 'urn:ietf:params:oauth:token-type:access_token',
    };

    try {
        const response = await keycloakAxios.post(
            `/protocol/openid-connect/token`,
            Object.keys(formData)
                .map(key => `${key}=${encodeURIComponent(formData[key])}`)
                .join('&'),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        handleTokens(targetClient, response.data);
        setTimeout(() => exchangeToken({ sourceClient, targetClient }), (response.data.expires_in - 20) * 1000);
        return response.data;
    } catch (_) {
        console.log(_)
    }
}

const logout = () => {
    switch (process.env.REACT_APP_LOGIN_METHOD) {
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

export { tokens, keycloak, logout, exchangeToken, injectBearerToken };
