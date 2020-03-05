import { connect } from "react-redux";
import Location from "./Location";
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    toggleHiddenRegion
} from "../../../../actions/uiActions";

function mapStateToProps(state) {
    return {
        locationLayout: state.application.locationLayout,
        userData: state.application.userData,
        showEqpTree: state.ui.layout.showEqpTree,
        hiddenRegions: state.ui.hiddenRegions,
        eqp: state.ui.layout.equipment,
        applicationData: state.application.applicationData
    };
}

const LocationContainer = connect(mapStateToProps, {
    showNotification,
    showError,
    handleError,
    setLayoutProperty,
    toggleHiddenRegion
})(Location);

export default LocationContainer;
