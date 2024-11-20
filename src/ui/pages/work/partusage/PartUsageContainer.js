import {connect} from 'react-redux'
import {handleError, showError, showNotification, showWarning} from '../../../../actions/uiActions'
import PartUsage from "./PartUsage";

const PartUsageContainer = connect(null, {
        showNotification,
        showError,
        showWarning,
        handleError
    }
)(PartUsage);

export default PartUsageContainer;