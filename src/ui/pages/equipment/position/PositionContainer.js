import {connect} from 'react-redux'
import Position from './Position'
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    toggleHiddenRegion
} from '../../../../actions/uiActions'
import { isHiddenRegion, getUniqueRegionID } from '../../../../selectors/uiSelectors'

function mapStateToProps(state) {
    const entityScreenCode = state.application.userData.positionScreen;
    return {
        positionLayout: state.application.positionLayout,
        userData: state.application.userData,
        showEqpTree: state.ui.layout.showEqpTree,
        hiddenRegions: state.ui.hiddenRegions,
        isHiddenRegion: isHiddenRegion(state)(entityScreenCode),
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
    }
)(Position)

export default PositionContainer