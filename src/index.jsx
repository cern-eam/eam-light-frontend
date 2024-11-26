import "core-js";
import "regenerator-runtime";
import { polyfill } from "es6-promise";
import * as React from "react";
import ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import EamlightContainer from "./EamlightContainer";
import { applyMiddleware, createStore, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
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
import { UPDATE_SCANNED_USER } from "./actions/scannedUserActions";
import AuthWrapper, { tokens, keycloak } from "./AuthWrapper";

const jss = create(jssPreset());

unregister();
polyfill();

Ajax.getAxiosInstance().interceptors.request.use(
  (config) => {
    if (import.meta.env.VITE_LOGIN_METHOD !== "OPENID") {
      return config;
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

function createAxiosAuthMiddleware() {
  return ({ getState }) =>
    (next) =>
    (action) => {
      const inforContext = getState().inforContext;
      if (action.type === UPDATE_SCANNED_USER) {
        Ajax.getAxiosInstance().defaults.headers.common.INFOR_USER =
          (action.value && action.value.userCode) || "";
      } else if (inforContext) {
        Ajax.getAxiosInstance().defaults.headers.common.INFOR_USER =
          inforContext.INFOR_USER;
        Ajax.getAxiosInstance().defaults.headers.common.INFOR_PASSWORD =
          inforContext.INFOR_PASSWORD;
        Ajax.getAxiosInstance().defaults.headers.common.INFOR_ORGANIZATION =
          inforContext.INFOR_ORGANIZATION;
        Ajax.getAxiosInstance().defaults.headers.common.INFOR_SESSIONID =
          inforContext.INFOR_SESSIONID;
        Ajax.getAxiosInstance().defaults.headers.common.INFOR_TENANT =
          inforContext.INFOR_TENANT;
      }
      next(action);
    };
}

const store = createStore(
  rootReducer,
  applyMiddleware(createAxiosAuthMiddleware(), thunk)
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
      <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={enGB}>
          <div style={{ width: "100%", height: "100%" }}>
            <EamlightContainer />
            <SnackbarLight />
          </div>
        </LocalizationProvider>
      </Provider>
    </StylesProvider>
  </AuthWrapper>
);
