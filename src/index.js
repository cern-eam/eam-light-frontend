import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import './index.css';
import EamlightContainer from './EamlightContainer';
import registerServiceWorker from './registerServiceWorker';
import {applyMiddleware, createStore} from "redux";
import thunk from 'redux-thunk';
import rootReducer from "./reducers";
import 'babel-polyfill';
import { unregister } from './registerServiceWorker';
import JssProvider from 'react-jss/lib/JssProvider';
import { create } from 'jss';
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles';
import SnackbarContainer from "./ui/components/snackbar/SnackbarContainer";
import Ajax from 'eam-components/dist/tools/ajax'

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());

unregister();

function createAxiosAuthMiddleware() {
    return ({ getState }) => next => (action) => {
        const inforContext = getState().inforContext;
        if (inforContext) {
            Ajax.getAxiosInstance().defaults.headers.common.INFOR_USER = inforContext.INFOR_USER;
            Ajax.getAxiosInstance().defaults.headers.common.INFOR_PASSWORD = inforContext.INFOR_PASSWORD;
            Ajax.getAxiosInstance().defaults.headers.common.INFOR_ORGANIZATION = inforContext.INFOR_ORGANIZATION;
            Ajax.getAxiosInstance().defaults.headers.common.INFOR_SESSIONID = inforContext.INFOR_SESSIONID;
        }
        next(action)
    };
}

const store = createStore(rootReducer, applyMiddleware(createAxiosAuthMiddleware(), thunk))

ReactDOM.render(
    <JssProvider jss={jss} generateClassName={generateClassName}>
        <Provider store={store}>
            <div style={{width: "100%", height: "100%"}}>
                <EamlightContainer />
                <SnackbarContainer />
            </div>
        </Provider>
    </JssProvider>
    ,document.getElementById('root'));
registerServiceWorker();
