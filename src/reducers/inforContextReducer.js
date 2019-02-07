import {UPDATE_INFOR_CONTEXT} from '../actions/inforContextActions'

export default function inforContext(state = buildInforContextObject(), action) {
    switch(action.type) {
        case UPDATE_INFOR_CONTEXT:
            return action.value
        default:
            return state
    }
}

function buildInforContextObject() {
    return null;
}
