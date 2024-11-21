import {combineReducers} from 'redux'
import ui from './uiReducers'
import inforContext from './inforContextReducer'
import scannedUser from './scannedUserReducer'

export default combineReducers({
    ui,
    inforContext,
    scannedUser,
})
