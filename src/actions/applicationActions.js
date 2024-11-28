import WS from "../tools/WS";
import queryString from "query-string"
import { 
        TAB_CODES,
        TAB_CODES_NCR,
        TAB_CODES_ASSETS, 
        TAB_CODES_LOCATIONS, 
        TAB_CODES_POSITIONS, 
        TAB_CODES_SYSTEMS, 
        TAB_CODES_WORK_ORDERS, 
        TAB_CODES_PARTS 
    } from "../ui/components/entityregions/TabCodeMapping"
export const UPDATE_APPLICATION = 'UPDATE_APPLICATION';

export function updateApplication(value) {
    return {
        type: UPDATE_APPLICATION,
        value: value
    }
}

const RETRIES_ALLOWED = 5;

export function getUserInfo() {
    return (dispatch) => {
        let retriesDone = 0;

        const fetchUserData = () => {
            //Get URL parameters
            const values = queryString.parse(window.location.search);
            const screenCode = values.screen;
            const currentScreen = window.location.pathname
                .replace(import.meta.env.VITE_PUBLIC_URL, '')
                .split('/')[1];
            return WS.getUserData(currentScreen, screenCode);
        };

        const handleUserDataResponseError = (error) => {
            if (error?.response?.status === 403) {
                dispatch(
                    updateApplication({ userData: { invalidAccount: true } })
                );
            } else if (error?.response?.status === 404 || error?.response?.status === 500) {
                dispatch(
                  updateApplication({ userData: { userDataFetchingFailed: true } })
                );
            }
             else {
                dispatch(updateApplication({ userData: {} }));
            }
        };

        const fetchScreenLayout = (response) => {
            let userdata = response.body.data;

            Promise.all(createPromiseArray(userdata))
                .then((values) => {
                    let serviceAccounts;
                    try {
                        serviceAccounts =
                            values[0].body.data.EL_SERVI &&
                            Object.keys(
                                JSON.parse(values[0].body.data.EL_SERVI)
                            );
                    } catch (err) {
                        serviceAccounts = [];
                    }
                    dispatch(
                        updateApplication({
                            userData: response.body.data,
                            applicationData: {
                                ...values[0].body.data,
                                serviceAccounts,
                            },
                            assetLayout: values[1] ? values[1].body.data : null,
                            positionLayout: values[2] ? values[2].body.data : null,
                            systemLayout: values[3] ? values[3].body.data : null,
                            partLayout: values[4] ? values[4].body.data : null,
                            workOrderLayout: values[5] ? values[5].body.data : null,
                            locationLayout: values[6] ? values[6].body.data : null,
                            ncrLayout:  values[7] ? values[7].body.data : null
                        })
                    );
                })
                .catch((error) => {
                    if (retriesDone++ < RETRIES_ALLOWED) {
                        console.error(
                            `Error fetching screen layouts, retrying (attempt number ${retriesDone})...`
                        );
                        fetchScreenLayout(response);
                    } else {
                        console.error(
                            `Error fetching screen layouts, maximum number of retries reached: ${RETRIES_ALLOWED}`
                        );
                        dispatch(
                            updateApplication({
                                userData: {
                                    screenLayoutFetchingFailed: true,
                                },
                            })
                        );
                    }
                });
        };

        return fetchUserData()
            .then(fetchScreenLayout)
            .catch(handleUserDataResponseError);
    };
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
            }).catch(console.error);
    }
}

export function updateWorkOrderScreenLayout(screenCode) {
    return updateScreenLayout('EVNT', 'workOrder', 'WSJOBS', screenCode, TAB_CODES_WORK_ORDERS)
}

export function updateAssetScreenLayout(screenCode) {
    return updateScreenLayout('OBJ', 'asset', 'OSOBJA', screenCode, TAB_CODES_ASSETS);
}

export function updateNCRScreenLayout(screenCode) {
    return updateScreenLayout('NOCF', 'ncr', 'OSNCHD', screenCode, TAB_CODES_NCR);
}

export function updatePositionScreenLayout(screenCode) {
    return updateScreenLayout('OBJ', 'position', 'OSOBJP', screenCode, TAB_CODES_POSITIONS);
}

export function updateSystemScreenLayout(screenCode) {
    return updateScreenLayout('OBJ', 'system', 'OSOBJS', screenCode, TAB_CODES_SYSTEMS);
}

export function updatePartScreenLayout(screenCode) {
    return updateScreenLayout('PART', 'part', 'SSPART', screenCode, TAB_CODES_PARTS);
}

export function updateLocationScreenLayout(screenCode) {
    return updateScreenLayout('OBJ', 'location', 'OSOBJL', screenCode, TAB_CODES_LOCATIONS)
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
            userdata.assetScreen, TAB_CODES_ASSETS);
    }
    //
    let positionScreenPromise = Promise.resolve(false);
    if (userdata.positionScreen) {
        positionScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'OBJ', 'OSOBJP',
            userdata.positionScreen, TAB_CODES_POSITIONS)
    }
    //
    let systemScreenPromise = Promise.resolve(false);
    if (userdata.systemScreen) {
        systemScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'OBJ', 'OSOBJS',
            userdata.systemScreen, TAB_CODES_SYSTEMS)
    }
    //
    let partScreenPromise = Promise.resolve(false);
    if (userdata.partScreen) {
        partScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'PART', "SSPART",
            userdata.partScreen, TAB_CODES_PARTS)
    }
    //
    let woScreenPromise = Promise.resolve(false);
    if (userdata.workOrderScreen) {
        woScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'EVNT', "WSJOBS",
            userdata.workOrderScreen, TAB_CODES_WORK_ORDERS)
    }

     //
     let locationScreenPromise = Promise.resolve(false);
     if (userdata.locationScreen) {
        locationScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup,'LOC', "OSOBJL",
             userdata.locationScreen, TAB_CODES_LOCATIONS)
     }

    //
    let ncrScreenPromise = Promise.resolve(false);
    if (userdata.ncrScreen) {
        ncrScreenPromise = WS.getScreenLayout(userdata.eamAccount.userGroup, 'NOCF', 'OSNCHD',
            userdata.ncrScreen, TAB_CODES_NCR);
    }

    return [applicationDataPromise,
        assetScreenPromise,
        positionScreenPromise,
        systemScreenPromise,
        partScreenPromise,
        woScreenPromise,
        locationScreenPromise,
        ncrScreenPromise
    ]
}

