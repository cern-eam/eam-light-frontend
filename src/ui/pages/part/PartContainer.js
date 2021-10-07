import {connect} from 'react-redux';
import Part from './Part';
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    setHiddenRegions,
} from '../../../actions/uiActions';
import { getUniqueRegionID } from '../../../selectors/uiSelectors'

function mapStateToProps(state) {
    const entityScreenCode = state.application.userData.partScreen;
    return {
        partLayout: state.application.partLayout,
        hiddenRegions: state.ui.hiddenRegions,
        getUniqueRegionID: getUniqueRegionID(state)(entityScreenCode),
        userData: state.application.userData,
        applicationData: state.application.applicationData
    }
}

const PartContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError,
        setLayoutProperty,
        setHiddenRegions,
    }
)(Part);

export default PartContainer;