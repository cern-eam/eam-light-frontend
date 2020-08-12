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

const isLocalAdministrator = ({ userData }) => () => userData &&
    userData.eamAccount &&
    userData.eamAccount.userDefinedFields &&
    userData.eamAccount.userDefinedFields.udfchkbox01;

export const applicationGetters = state => {
    const getters = {
        isLocalAdministrator
    };

    return Object.keys(getters).reduce((acc, key) => Object.assign(acc, {[key]: getters[key](state)}), {})
}