import {SET_LAYOUT, SET_SNACKBAR_MESSAGE} from "../actions/uiActions";

export default function ui(state = buildDefaultUiObject(), action) {
    switch(action.type) {
        case SET_SNACKBAR_MESSAGE:
            return  {
                ...state,
                snackbar: action.snackbar
            }
        case SET_LAYOUT:
            return {
                ...state,
                layout: {
                    ...state.layout,
                    ...action.layout
                }
            }
        default:
            return state
    }
}

function buildDefaultUiObject() {

    return {
        snackbar: {message: "", type: "", open: false}
    }
}