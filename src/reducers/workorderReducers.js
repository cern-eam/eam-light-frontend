import {UPDATE_WO} from '../actions/workorderActions'

export function workorder(state = buildWorkOrderObject(), action) {
    switch(action.type) {
        case UPDATE_WO:
            return {
                ...state,
                ...action.value
            }
        default:
            return state
    }
}

function buildWorkOrderObject() {
    return {
        myOpenWorkOrders: [],
        myTeamWorkOrders: []
    }
}


