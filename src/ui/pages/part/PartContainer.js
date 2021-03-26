import {connect} from 'react-redux';
import Part from './Part';
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    toggleHiddenRegion,
    setRegionVisibility
} from '../../../actions/uiActions';
import { isHiddenRegion, getHiddenRegionState, getUniqueRegionID } from '../../../selectors/uiSelectors'

function mapStateToProps(state) {
    const entityScreenCode = state.application.userData.partScreen;
    return {
        partLayout: state.application.partLayout,
        hiddenRegions: state.ui.hiddenRegions,
        isHiddenRegion: isHiddenRegion(state)(entityScreenCode),
        getHiddenRegionState: getHiddenRegionState(state)(entityScreenCode),
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
        toggleHiddenRegion,
        setRegionVisibility,
    }
)(Part);

export default PartContainer;