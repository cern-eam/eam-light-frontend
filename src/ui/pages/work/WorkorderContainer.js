import {connect} from 'react-redux'
import Workorder from './Workorder'
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    setHiddenRegions,
} from '../../../actions/uiActions'
import {updateMyWorkOrders} from '../../../actions/workorderActions'
import {updateApplication} from '../../../actions/applicationActions'
import { getUniqueRegionID } from '../../../selectors/uiSelectors'


function mapStateToProps(state) {
    const entityScreenCode = state.application.userData.workOrderScreen;
    return {
        workOrderLayout: state.application.workOrderLayout,
        userData: state.application.userData,
        hiddenRegions: state.ui.hiddenRegions,
        applicationData: state.application.applicationData,
        getUniqueRegionID: getUniqueRegionID(state)(entityScreenCode),
    }
}

const WorkorderContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError,
        updateMyWorkOrders,
        setLayoutProperty,
        updateApplication,
        setHiddenRegions,
    }
)(Workorder)

export default WorkorderContainer