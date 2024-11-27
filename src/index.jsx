import "core-js";
import "regenerator-runtime";
import { polyfill } from "es6-promise";
import * as React from "react";
import ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";
import "./index.css";
import Eamlight from "./Eamlight";
import { unregister } from "./registerServiceWorker";
import { create } from "jss";
import StylesProvider from "@mui/styles/StylesProvider";
import jssPreset from "@mui/styles/jssPreset";
//import SnackbarContainer from "./ui/components/snackbar/SnackbarContainer";
import SnackbarLight from "./ui/components/snackbar-new/Snackbar";
import Ajax from "eam-components/dist/tools/ajax";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// EAM-480, en-GB locale used in order to have monday as first day of the week
import { enGB } from "date-fns/locale";
import AuthWrapper, { tokens, keycloak } from "./AuthWrapper";
import useInforContextStore from "./state/useInforContext";
import useScannedUserStore from "./state/useScannedUserStore";

const jss = create(jssPreset());

unregister();
polyfill();

Ajax.getAxiosInstance().interceptors.request.use(
  (config) => {
    if (import.meta.env.VITE_LOGIN_METHOD !== "OPENID") {
      const {inforContext} = useInforContextStore.getState();
      if (inforContext) {
          config.headers.INFOR_USER = inforContext.INFOR_USER;
          config.headers.INFOR_PASSWORD = inforContext.INFOR_PASSWORD;
          config.headers.INFOR_ORGANIZATION = inforContext.INFOR_ORGANIZATION;
          config.headers.INFOR_SESSIONID = inforContext.INFOR_SESSIONID;
          config.headers.INFOR_TENANT = inforContext.INFOR_TENANT;
      }
      return config;
    }

    //
    const {scannedUser} = useScannedUserStore.getState();
    if (scannedUser && scannedUser.userCode) {
      config.headers.INFOR_USER = scannedUser.userCode;
    }

    // updateToken if it will last less than 5 minutes
    return keycloak.updateToken(300).then(() => {
      const newConfig = config;
      if (tokens && tokens.token) {
        newConfig.headers.Authorization = `Bearer ${tokens.token}`;
      }
      return newConfig;
    });
  },
  (error) => {
    Promise.reject(error);
  }
);

// Manage runtime errors with overlay
window.onerror = (event, source, lineno, colno, err) => {
  // must be within function call because that's when the element is defined for sure.
  const ErrorOverlay = customElements.get("vite-error-overlay");
  // don't open outside vite environment
  if (!ErrorOverlay) return;

  const overlay = new ErrorOverlay(err);
  document.body.appendChild(overlay);
};

ReactDOMClient.createRoot(document.getElementById("root")).render(
  <AuthWrapper>
    <StylesProvider jss={jss}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={enGB}>
          <div style={{ width: "100%", height: "100%" }}>
            <Eamlight />
            <SnackbarLight />
          </div>
        </LocalizationProvider>
    </StylesProvider>
  </AuthWrapper>
);
