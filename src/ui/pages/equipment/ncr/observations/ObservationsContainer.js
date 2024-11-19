import { connect } from "react-redux";
import {
    handleError,
    showError,
    showNotification,
} from "../../../../../actions/uiActions";
import Observations from "./Observations";

function mapStateToProps(state) {
    return {
        userData: state.application.userData,
    };
}

const ObservationsContainer = connect(mapStateToProps, {
    showNotification,
    showError,
    handleError,
})(Observations);

export default ObservationsContainer;
