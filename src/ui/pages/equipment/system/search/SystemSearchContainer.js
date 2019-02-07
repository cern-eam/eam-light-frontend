import {connect} from 'react-redux'
import SystemSearch from './SystemSearch'
import {handleError} from "../../../../../actions/uiActions";

function mapStateToProps(state) {
    return {
        systemScreen: state.application.userData.screens[state.application.userData.systemScreen]
    }
}

const SystemSearchContainer = connect(mapStateToProps, {
    handleError
})(SystemSearch)

export default SystemSearchContainer