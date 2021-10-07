import {connect} from 'react-redux';
import System from './System';
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    setHiddenRegions,
} from '../../../../actions/uiActions';
import { getUniqueRegionID } from '../../../../selectors/uiSelectors'

function mapStateToProps(state) {
    const entityScreenCode = state.application.userData.systemScreen;
    return {
        systemLayout: state.application.systemLayout,
        userData: state.application.userData,
        showEqpTree: state.ui.layout.showEqpTree,
        hiddenRegions: state.ui.hiddenRegions,
        eqp: state.ui.layout.equipment,
        applicationData: state.application.applicationData,
        getUniqueRegionID: getUniqueRegionID(state)(entityScreenCode),
    }
}

const SystemContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError,
        setLayoutProperty,
        setHiddenRegions,
    }
)(System);

export default SystemContainer;