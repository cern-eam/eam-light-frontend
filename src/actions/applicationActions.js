import WS from "../tools/WS";
import queryString from "query-string"
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
                .replace(process.env.PUBLIC_URL, '')
                .split('/')[1];
            return WS.getUserData(currentScreen, screenCode);
        };

        const handleUserDataResponseError = (error) => {
            if (error?.response?.status === 403) {
                dispatch(
                    updateApplication({ userData: { invalidAccount: true } })
                );
            } else {
                dispatch(updateApplication({ userData: {} }));
            }
        };

        const fetchScreenLayout = (response) => {
            let userdata = response.body.data;

            Promise.all(createPromiseArray(userdata))
                .then((values) => {
                    dispatch(
                        updateApplication({
                            userData: response.body.data
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
    return [applicationDataPromise
    ]
}

