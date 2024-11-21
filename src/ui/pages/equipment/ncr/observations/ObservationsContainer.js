import { connect } from "react-redux";
import { handleError, showError, showNotification } from "@/actions/uiActions";
import Observations from "./Observations";

const ObservationsContainer = connect(null, {
    showNotification,
    showError,
    handleError,
})(Observations);

export default ObservationsContainer;
