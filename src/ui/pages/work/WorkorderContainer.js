import {connect} from 'react-redux'
import Workorder from './Workorder'
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    toggleHiddenRegion,
} from '../../../actions/uiActions'
import {updateMyWorkOrders} from '../../../actions/workorderActions'
import {updateApplication} from '../../../actions/applicationActions'
import { isHiddenRegion, getUniqueRegionID } from '../../../selectors/uiSelectors'


function mapStateToProps(state) {
    const entityScreenCode = state.application.userData.workOrderScreen;
    return {
        workOrderLayout: state.application.workOrderLayout,
        userData: state.application.userData,
        hiddenRegions: state.ui.hiddenRegions,
        applicationData: state.application.applicationData,
        isHiddenRegion: isHiddenRegion(state)(entityScreenCode),
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
        toggleHiddenRegion
    }
)(Workorder)

export default WorkorderContainer