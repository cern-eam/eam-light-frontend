import {connect} from 'react-redux'
import Position from './Position'
import {
    showNotification, showError, handleError, setLayoutProperty,
    toggleHiddenRegion
} from '../../../../actions/uiActions'

function mapStateToProps(state) {
    return {
        positionLayout: state.application.positionLayout,
        userData: state.application.userData,
        showEqpTree: state.ui.layout.showEqpTree,
        hiddenRegions: state.ui.hiddenRegions,
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