import {connect} from 'react-redux';
import PositionSearch from './PositionSearch';
import { handleError } from "../../../../../actions/uiActions";

function mapStateToProps(state) {
    return {
        positionScreen: state.application.userData.screens[state.application.userData.positionScreen]
    }
}

const PositionSearchContainer = connect(mapStateToProps, {
    handleError
})(PositionSearch)

export default PositionSearchContainer