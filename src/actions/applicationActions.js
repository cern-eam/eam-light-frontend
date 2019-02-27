import WS from "../tools/WS";
import queryString from "query-string"

export const UPDATE_APPLICATION = 'UPDATE_APPLICATION';

export function updateApplication(value) {
    return {
        type: UPDATE_APPLICATION,
        value: value
    }
}

export function getUserInfo() {
    return (dispatch) => {
        //Get URL parameters
        const values = queryString.parse(window.location.search)
        const screenCode = values.screen;
        const currentScreen = window.location.pathname.replace(process.env.PUBLIC_URL,'').split('/')[0];
        return WS.getUserData(currentScreen, screenCode)
            .then(response => {
                let userdata = response.body.data;
                Promise.all(createPromiseArray(userdata)).then(values => {
                    dispatch(updateApplication({
                        userData: response.body.data,
                        applicationData: values[0].body.data,
                        assetLayout: values[1] ? values[1].body.data : null,
                        positionLayout: values[2] ? values[2].body.data : null,
                        systemLayout: values[3] ? values[3].body.data : null,
                        partLayout: values[4] ? values[4].body.data : null,
                        workOrderLayout: values[5] ? values[5].body.data : null,
                    }))
                })
            })
            .catch(response => {
                dispatch(updateApplication({userData: {invalidAccount: true}}))
            })
    }
}



export function updateWorkOrderScreenLayout(screenCode) {
    return (dispatch, getState) => {
        WS.getScreenLayout('EVNT', "WSJOBS", screenCode, ['ACT', 'BOO', 'PAR', 'ACK', 'MEC', 'CWO'])
          .then(response => {
            dispatch(updateApplication({
                workOrderLayout: response.body.data,
                userData: {
                    ...getState().application.userData,
                    workOrderScreen: screenCode
                }
            }))
        })
    }
}

export function updateAssetScreenLayout(screenCode) {
    return (dispatch, getState) => {
        WS.getScreenLayout('OBJ', 'OSOBJA', screenCode, ['PAS'])
          .then(response => {
            dispatch(updateApplication({
                assetLayout: response.body.data,
                userData: {
                    ...getState().application.userData,
                    assetScreen: screenCode
                }
            }))
        })
    }
}

export function updatePositionScreenLayout(screenCode) {
    return (dispatch, getState) => {
        WS.getScreenLayout('OBJ', 'OSOBJP', screenCode, ['PAS'])
            .then(response => {
                dispatch(updateApplication({
                    positionLayout: response.body.data,
                    userData: {
                        ...getState().application.userData,
                        positionScreen: screenCode
                    }
                }))
            })
    }
}

export function updateSystemScreenLayout(screenCode) {
    return (dispatch, getState) => {
        WS.getScreenLayout('OBJ', 'OSOBJS', screenCode, ['PAS'])
            .then(response => {
                dispatch(updateApplication({
                    systemLayout: response.body.data,
                    userData: {
                        ...getState().application.userData,
                        systemScreen: screenCode
                    }
                }))
            })
    }
}

export function updatePartScreenLayout(screenCode) {
    return (dispatch, getState) => {
        WS.getScreenLayout('PART', "SSPART", screenCode, ['EPA'])
            .then(response => {
                dispatch(updateApplication({
                    partLayout: response.body.data,
                    userData: {
                        ...getState().application.userData,
                        partScreen: screenCode
                    }
                }))
            })
    }
}


/**
 * Create promise array with layout information for main screens
 *
 * @param userdata
 * @returns {*[]}
 */
function createPromiseArray(userdata) {
    //
    let applicationDataPromise = WS.getApplicationData();
    //
    let assetScreenPromise = Promise.resolve(false);
    if (userdata.assetScreen) {
        assetScreenPromise = WS.getScreenLayout('OBJ', 'OSOBJA',
            userdata.assetScreen, ['PAS'])
    }
    //
    let positionScreenPromise = Promise.resolve(false);
    if (userdata.positionScreen) {
        positionScreenPromise = WS.getScreenLayout('OBJ', 'OSOBJP',
            userdata.positionScreen, ['PAS'])
    }
    //
    let systemScreenPromise = Promise.resolve(false);
    if (userdata.systemScreen) {
        systemScreenPromise = WS.getScreenLayout('OBJ', 'OSOBJS',
            userdata.systemScreen, ['PAS'])
    }
    //
    let partScreenPromise = Promise.resolve(false);
    if (userdata.partScreen) {
        partScreenPromise = WS.getScreenLayout('PART', "SSPART",
            userdata.partScreen, ['EPA'])
    }
    //
    let woScreenPromise = Promise.resolve(false);
    if (userdata.workOrderScreen) {
        woScreenPromise = WS.getScreenLayout('EVNT', "WSJOBS",
            userdata.workOrderScreen,
            ['ACT', 'BOO', 'PAR', 'ACK', 'MEC', 'CWO'])
    }

    return [applicationDataPromise,
        assetScreenPromise,
        positionScreenPromise,
        systemScreenPromise,
        partScreenPromise,
        woScreenPromise]
}