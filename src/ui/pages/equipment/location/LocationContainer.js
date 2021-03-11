import { connect } from "react-redux";
import Location from "./Location";
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    toggleHiddenRegion,
    setRegionVisibility,
} from "../../../../actions/uiActions";
import { isHiddenRegion, getHiddenRegionState, getUniqueRegionID } from '../../../../selectors/uiSelectors'

function mapStateToProps(state) {
    const entityScreenCode = state.application.userData.locationScreen;
    return {
        locationLayout: state.application.locationLayout,
        userData: state.application.userData,
        showEqpTree: state.ui.layout.showEqpTree,
        hiddenRegions: state.ui.hiddenRegions,
        eqp: state.ui.layout.equipment,
        applicationData: state.application.applicationData,
        isHiddenRegion: isHiddenRegion(state)(entityScreenCode),
        getHiddenRegionState: getHiddenRegionState(state)(entityScreenCode),
        getUniqueRegionID: getUniqueRegionID(state)(entityScreenCode),
    };
}

const LocationContainer = connect(mapStateToProps, {
    showNotification,
    showError,
    handleError,
    setLayoutProperty,
    toggleHiddenRegion,
    setRegionVisibility,
})(Location);

export default LocationContainer;
