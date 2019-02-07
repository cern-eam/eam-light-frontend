import {connect} from 'react-redux'
import PartSearch from './PartSearch'
import {handleError} from "../../../../actions/uiActions";

function mapStateToProps(state) {
    return {
        partScreen: state.application.userData.screens[state.application.userData.partScreen]
    }
}

const PartSearchContainer = connect(mapStateToProps, {
    handleError
})(PartSearch)

export default PartSearchContainer