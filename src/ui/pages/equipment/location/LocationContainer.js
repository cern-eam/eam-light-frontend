import { connect } from "react-redux";
import Location from "./Location";
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    setHiddenRegions,
} from "../../../../actions/uiActions";
import { getUniqueRegionID } from '../../../../selectors/uiSelectors'

function mapStateToProps(state) {
    const entityScreenCode = state.application.userData.locationScreen;
    return {
        locationLayout: state.application.locationLayout,
        userData: state.application.userData,
        showEqpTree: state.ui.layout.showEqpTree,
        hiddenRegions: state.ui.hiddenRegions,
        eqp: state.ui.layout.equipment,
        applicationData: state.application.applicationData,
        getUniqueRegionID: getUniqueRegionID(state)(entityScreenCode),
    };
}

const LocationContainer = connect(mapStateToProps, {
    showNotification,
    showError,
    handleError,
    setLayoutProperty,
    setHiddenRegions,
})(Location);

export default LocationContainer;
