import {connect} from 'react-redux'
import Position from './Position'
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    toggleHiddenRegion,
    setRegionVisibility
} from '../../../../actions/uiActions'
import { isHiddenRegion, getHiddenRegionState, getUniqueRegionID } from '../../../../selectors/uiSelectors'

function mapStateToProps(state) {
    const entityScreenCode = state.application.userData.positionScreen;
    return {
        positionLayout: state.application.positionLayout,
        userData: state.application.userData,
        showEqpTree: state.ui.layout.showEqpTree,
        hiddenRegions: state.ui.hiddenRegions,
        isHiddenRegion: isHiddenRegion(state)(entityScreenCode),
        getHiddenRegionState: getHiddenRegionState(state)(entityScreenCode),
        getUniqueRegionID: getUniqueRegionID(state)(entityScreenCode),
        eqp: state.ui.layout.equipment,
        applicationData: state.application.applicationData,
    }
}

const PositionContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError,
        setLayoutProperty,
        toggleHiddenRegion,
        setRegionVisibility
    }
)(Position)

export default PositionContainer