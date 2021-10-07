import {connect} from 'react-redux'
import Position from './Position'
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    setHiddenRegions,
} from '../../../../actions/uiActions'
import { getUniqueRegionID } from '../../../../selectors/uiSelectors'

function mapStateToProps(state) {
    const entityScreenCode = state.application.userData.positionScreen;
    return {
        positionLayout: state.application.positionLayout,
        userData: state.application.userData,
        showEqpTree: state.ui.layout.showEqpTree,
        hiddenRegions: state.ui.hiddenRegions,
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
        setHiddenRegions,
    }
)(Position)

export default PositionContainer