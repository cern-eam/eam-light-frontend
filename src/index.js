import "core-js";
import "regenerator-runtime";
import {polyfill} from 'es6-promise';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import EamlightContainer from './EamlightContainer';
import {applyMiddleware, createStore} from "redux";
import thunk from 'redux-thunk';
import rootReducer from "./reducers";
import {unregister} from './registerServiceWorker';
import {create} from "jss";
import {StylesProvider, jssPreset} from '@material-ui/core/styles';
import SnackbarContainer from "./ui/components/snackbar/SnackbarContainer";
import Ajax from 'eam-components/dist/tools/ajax'
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// EAM-480, en-GB locale used in order to have monday as first day of the week
import { enGB } from "date-fns/locale";

const jss = create(jssPreset());

unregister();
polyfill();

function createAxiosAuthMiddleware() {
    return ({ getState }) => next => (action) => {
        const inforContext = getState().inforContext;
        const scannedUser = getState().scannedUser;
        if (scannedUser && scannedUser.userCode) {
            Ajax.getAxiosInstance().defaults.headers.common.INFOR_USER = scannedUser.userCode;
        } else if (inforContext) {
            Ajax.getAxiosInstance().defaults.headers.common.INFOR_USER = inforContext.INFOR_USER;
            Ajax.getAxiosInstance().defaults.headers.common.INFOR_PASSWORD = inforContext.INFOR_PASSWORD;
            Ajax.getAxiosInstance().defaults.headers.common.INFOR_ORGANIZATION = inforContext.INFOR_ORGANIZATION;
            Ajax.getAxiosInstance().defaults.headers.common.INFOR_SESSIONID = inforContext.INFOR_SESSIONID;
            Ajax.getAxiosInstance().defaults.headers.common.INFOR_TENANT = inforContext.INFOR_TENANT;
        }
        next(action)
    };
}

const store = createStore(rootReducer, applyMiddleware(createAxiosAuthMiddleware(), thunk))

ReactDOM.render(
    <StylesProvider jss={jss}>
        <Provider store={store}>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enGB}>
                <div style={{width: "100%", height: "100%"}}>
                    <EamlightContainer />
                    <SnackbarContainer />
                </div>
            </MuiPickersUtilsProvider>
        </Provider>
    </StylesProvider>
    ,document.getElementById('root'));
