import {connect} from 'react-redux'
import Workorder from './Workorder'
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    toggleHiddenRegion
} from '../../../actions/uiActions'
import {updateMyWorkOrders} from '../../../actions/workorderActions'
import {updateApplication} from '../../../actions/applicationActions'

function mapStateToProps(state) {
    return {
        workOrderLayout: state.application.workOrderLayout,
        userData: state.application.userData,
        hiddenRegions: state.ui.hiddenRegions,
        applicationData: state.application.applicationData
    }
}

const WorkorderContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError,
        updateMyWorkOrders,
        setLayoutProperty,
        updateApplication,
        toggleHiddenRegion,
    }
)(Workorder)

export default WorkorderContainer