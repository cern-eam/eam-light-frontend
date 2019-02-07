import { combineReducers } from 'redux'
import { workorder } from './workorderReducers'
import ui from './uiReducers'
import application from './applicationReducers'
import inforContext from './inforContextReducer'

export default combineReducers({
    application,
    ui,
    workorder,
    inforContext
})
