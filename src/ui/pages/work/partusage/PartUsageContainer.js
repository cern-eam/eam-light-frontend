import {connect} from 'react-redux'
import {handleError, showError, showNotification, showWarning} from '../../../../actions/uiActions'
import PartUsage from "./PartUsage";

function mapStateToProps(state) {
    return {
        userData: state.application.userData
    }
}

const PartUsageContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        showWarning,
        handleError
    }
)(PartUsage);

export default PartUsageContainer;