import {connect} from 'react-redux'
import {handleError, showError, showWarning, showNotification} from '../../../../actions/uiActions'
import ReplaceEqp from "./ReplaceEqp";

function mapStateToProps(state) {
    return {
        userData: state.application.userData,
        equipmentLayout: state.application.assetLayout
    }
}

const ReplaceEqpContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        showWarning,
        handleError
    }
)(ReplaceEqp);

export default ReplaceEqpContainer;