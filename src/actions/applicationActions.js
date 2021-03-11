import WS from "../tools/WS";
import queryString from "query-string"
import { TAB_CODES } from "../ui/components/entityregions/TabCodeMapping"
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
        const currentScreen = window.location.pathname.replace(process.env.PUBLIC_URL,'').split('/')[1];
        return WS.getUserData(currentScreen, screenCode)
            .then(response => {
                let userdata = response.body.data;
                Promise.all(createPromiseArray(userdata)).then(values => {
                    let serviceAccounts;
                    try {
                        serviceAccounts = values[0].body.data.EL_SERVI && Object.keys(JSON.parse(values[0].body.data.EL_SERVI));
                    } catch (err) {
                        serviceAccounts = [];
                    }
                    dispatch(updateApplication({
                        userData: response.body.data,
                        applicationData: {
                            ...values[0].body.data,
                            serviceAccounts
                        },
                        assetLayout: values[1] ? values[1].body.data : null,
                        positionLayout: values[2] ? values[2].body.data : null,
                        systemLayout: values[3] ? values[3].body.data : null,
                        partLayout: values[4] ? values[4].body.data : null,
                        workOrderLayout: values[5] ? values[5].body.data : null,
                        locationLayout: values[6] ? values[6].body.data : null
                    }))
                })
            })
            .catch(response => {
                if (response && response.response.status === 403) {
                    dispatch(updateApplication({userData: {invalidAccount: true}}));
                }
                else {
                    dispatch(updateApplication({userData: {}}));
                }
            })
    }
}

export function updateScreenLayout(entity, entityDesc, systemFunction, userFunction, tabs) {
    return (dispatch, getState) => {
        let userData = getState().application.userData;
        WS.getScreenLayout(userData.eamAccount.userGroup, entity, systemFunction, userFunction, tabs)
            .then(response => {
                dispatch(updateApplication({
                    [entityDesc + 'Layout']: response.body.data,
                    userData: {
                        ...userData,
                        [entityDesc + 'Screen']: userFunction
                    }
                }))
            })
    }
}

export function updateWorkOrderScreenLayout(screenCode) {
    return updateScreenLayout('EVNT', 'workOrder', 'WSJOBS', screenCode,
                         ['ACT', 'BOO', 'PAR', 'ACK', 'MEC', 'CWO'])
}

export function updateAssetScreenLayout(screenCode) {
    return updateScreenLayout('OBJ', 'asset', 'OSOBJA', screenCode,['PAS']);
}

export function updatePositionScreenLayout(screenCode) {
    return updateScreenLayout('OBJ', 'position', 'OSOBJP', screenCode,['PAS']);
}

export function updateSystemScreenLayout(screenCode) {
    return updateScreenLayout('OBJ', 'system', 'OSOBJS', screenCode,['PAS']);
}

export function updatePartScreenLayout(screenCode) {
    return updateScreenLayout('PART', 'part', 'SSPART', screenCode,['EPA']);
}

export function updateLocationScreenLayout(screenCode) {
    return updateScreenLayout('OBJ', 'location', 'OSOBJL', screenCode, ['PAS'])
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
        assetScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup, 'OBJ', 'OSOBJA',
            userdata.assetScreen, [
                TAB_CODES.RECORD_VIEW,
                TAB_CODES.WORKORDERS,
                TAB_CODES.COMMENTS,
                TAB_CODES.PARTS_ASSOCIATED,
                TAB_CODES.EDMS_DOCUMENTS_ASSETS,
                TAB_CODES.EQUIPMENT_GRAPH_ASSETS
            ]);
    }
    //
    let positionScreenPromise = Promise.resolve(false);
    if (userdata.positionScreen) {
        positionScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'OBJ', 'OSOBJP',
            userdata.positionScreen, [
                TAB_CODES.RECORD_VIEW,
                TAB_CODES.WORKORDERS,
                TAB_CODES.COMMENTS,
                TAB_CODES.PARTS_ASSOCIATED,
                TAB_CODES.EDMS_DOCUMENTS_POSITIONS,
                TAB_CODES.EQUIPMENT_GRAPH_POSITIONS
            ])
    }
    //
    let systemScreenPromise = Promise.resolve(false);
    if (userdata.systemScreen) {
        systemScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'OBJ', 'OSOBJS',
            userdata.systemScreen, [
                TAB_CODES.RECORD_VIEW,
                TAB_CODES.WORKORDERS,
                TAB_CODES.COMMENTS,
                TAB_CODES.PARTS_ASSOCIATED,
                TAB_CODES.EDMS_DOCUMENTS_SYSTEMS,
                TAB_CODES.EQUIPMENT_GRAPH_SYSTEMS
            ])
    }
    //
    let partScreenPromise = Promise.resolve(false);
    if (userdata.partScreen) {
        partScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'PART', "SSPART",
            userdata.partScreen, [
                TAB_CODES.RECORD_VIEW,
                TAB_CODES.WHERE_USED,
                TAB_CODES.COMMENTS,
                TAB_CODES.STOCK,
                TAB_CODES.EDMS_DOCUMENTS_PARTS
            ])
    }
    //
    let woScreenPromise = Promise.resolve(false);
    if (userdata.workOrderScreen) {
        woScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'EVNT', "WSJOBS",
            userdata.workOrderScreen,
            [
                TAB_CODES.RECORD_VIEW,
                TAB_CODES.PART_USAGE,
                TAB_CODES.CHILD_WO,
                TAB_CODES.EDMS_DOCUMENTS_WORK_ORDERS,
                TAB_CODES.COMMENTS,
                TAB_CODES.ACTIVITIES,
                TAB_CODES.CHECKLIST,
                TAB_CODES.METER_READINGS,
                TAB_CODES.EQUIPMENT_TAB_WO_SCREEN,
                TAB_CODES.BOOK_LABOR,
                TAB_CODES.CLOSING_CODES
            ])
    }

     //
     let locationScreenPromise = Promise.resolve(false);
     if (userdata.locationScreen) {
        locationScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'LOC', "OSOBJL",
             userdata.locationScreen,
             [
                TAB_CODES.RECORD_VIEW,
                TAB_CODES.WORKORDERS,
                TAB_CODES.EDMS_DOCUMENTS_LOCATIONS,
                TAB_CODES.COMMENTS
            ])
     }

    return [applicationDataPromise,
        assetScreenPromise,
        positionScreenPromise,
        systemScreenPromise,
        partScreenPromise,
        woScreenPromise,
        locationScreenPromise
    ]
}

