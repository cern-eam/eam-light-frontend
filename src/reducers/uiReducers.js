import {SET_LAYOUT, SET_SNACKBAR_MESSAGE, TOGGLE_HIDDEN_REGION} from "../actions/uiActions";

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
        case TOGGLE_HIDDEN_REGION:
            let hiddenRegions = {
                ...state.hiddenRegions,
                [action.region]: !state.hiddenRegions[action.region]
            }
            // Save to local storage
            localStorage.setItem("hiddenRegions", JSON.stringify(hiddenRegions))
            return {
                ...state,
                hiddenRegions: hiddenRegions
            }
        default:
            return state
    }
}

function buildDefaultUiObject() {

    return {
        snackbar: {message: "", type: "", open: false},
        layout: {showEqpTreeButton: false, showEqpTree: false},
        hiddenRegions: JSON.parse(localStorage.getItem("hiddenRegions")) || {}
    }
}