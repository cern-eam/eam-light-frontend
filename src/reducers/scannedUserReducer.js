import { UPDATE_SCANNED_USER } from '../actions/scannedUserActions'

export default function scannedUser(state = null, action) {
    switch (action.type) {
        case UPDATE_SCANNED_USER:
            return action.value;
        default:
            return state;
    }
}
