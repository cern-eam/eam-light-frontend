import {UPDATE_APPLICATION} from '../actions/applicationActions'

export default function application(state = buildApplicationObject(), action) {
    switch(action.type) {
        case UPDATE_APPLICATION:
            return {
                ...state,
                ...action.value
            }
        default:
            return state
    }
}

function buildApplicationObject() {
    return {
       // for now nothing interesting here ...
    }
}
