import {connect} from 'react-redux';
import Part from './Part';
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    toggleHiddenRegion
} from '../../../actions/uiActions';
import { isHiddenRegion, getUniqueRegionID } from '../../../selectors/uiSelectors'

function mapStateToProps(state) {
    const entityScreenCode = state.application.userData.partScreen;
    return {
        partLayout: state.application.partLayout,
        hiddenRegions: state.ui.hiddenRegions,
        isHiddenRegion: isHiddenRegion(state)(entityScreenCode),
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
    }
)(Part);

export default PartContainer;