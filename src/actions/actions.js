import {updateMyOpenWorkOrders, updateMyTeamWorkOrders} from './workorderActions'
import {getUserInfo} from './applicationActions'

export function initializeApplication() {
    return function (dispatch, getState) {
        // fetch my and my team's work orders
        dispatch(updateMyOpenWorkOrders())
        dispatch(updateMyTeamWorkOrders())
        // fetch user info
        dispatch(getUserInfo())
    }
}
