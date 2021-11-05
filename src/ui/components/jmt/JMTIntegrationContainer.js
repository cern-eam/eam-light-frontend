import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import JMTIntegration from "./JMTIntegration";
import { showNotification, handleError, showError } from "../../../actions/uiActions";
import { withCernMode } from "../CERNMode";

/**
 * To get the value of a parameter from the URL
 * @param name (Key) of the parameter
 * @returns {string} The value of the parameter,or an empty string
 */
const getURLParameterByName = (name) => {
    const url = window.location.href;
    name = name.replace(/[[]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results || !results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const mapStateToProps = (state, ownProps) => {
    const { userData, applicationData } = state.application;
    const woCode = getURLParameterByName("workordernum");
    return {
        woCode,
        userData,
        applicationData,
    }
};

const JMTInteg = connect(mapStateToProps, {showNotification, handleError, showError})(JMTIntegration);

export default withCernMode(withRouter(JMTInteg))