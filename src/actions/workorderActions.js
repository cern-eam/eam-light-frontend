import WS from "../tools/WS";
import WSWorkorders from "../tools/WSWorkorders";
import {handleError, showNotification} from './uiActions';

export const UPDATE_WO = 'UPDATE_WO'

export function updateWorkorder(value) {
    return {
        type: UPDATE_WO,
        value: value
    }
}

export function updateMyOpenWorkOrders(number) {
    return (dispatch) => {
        return WS.getMyOpenWorkOrders()
            .then(response => {
                // Init new work order and inform the user
                dispatch(updateWorkorder({
                    myOpenWorkOrders: response.body.data
                }))
            })
    }
}

export function updateMyTeamWorkOrders(number) {
    return (dispatch) => {
        return WS.getMyTeamWorkOrders()
            .then(response => {
                // Init new work order and inform the user
                dispatch(updateWorkorder({
                    myTeamWorkOrders: response.body.data
                }))
            })
    }
}

export function updateMyWorkOrders(workorder) {
    return (dispatch, getState) => {
        let mywos = getState().workorder.myOpenWorkOrders
        let myteamwos = getState().workorder.myTeamWorkOrders

        // Process my TEAM's WOs
        myteamwos = myteamwos.map(wo => {
            if (wo.number === workorder.number) {
                return {
                    ...wo,
                    desc: workorder.description,
                    object: workorder.equipmentCode,
                    mrc: workorder.departmentCode,
                    opened: true
                }
            } else {
                return {
                    ...wo,
                    opened: false
                }
            }
        })

        dispatch(updateWorkorder({
            myTeamWorkOrders: myteamwos
        }))

        // Process my WOs
        mywos = mywos.map(wo => {
            if (wo.number === workorder.number) {
                return {
                    ...wo,
                    desc: workorder.description,
                    object: workorder.equipmentCode,
                    mrc: workorder.departmentCode,
                    opened: true
                }
            } else {
                return {
                    ...wo,
                    opened: false
                }
            }
        })

        dispatch(updateWorkorder({
            myOpenWorkOrders: mywos
        }))
    }
}
