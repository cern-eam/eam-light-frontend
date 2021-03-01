import { connect } from "react-redux";
import LocationSearch from "./LocationSearch";
import { handleError } from "../../../../../actions/uiActions";

function mapStateToProps(state) {
    return {
        locationScreen:
            state.application.userData.screens[
                state.application.userData.locationScreen
            ]
    };
}

const LocationSearchContainer = connect(mapStateToProps, {
    handleError
})(LocationSearch);

export default LocationSearchContainer;
