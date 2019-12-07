import {connect} from 'react-redux';
import {withRouter} from "react-router-dom";
import Impact from "./Impact";
import {handleError, showError} from "../../../actions/uiActions";

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
    const workorderNumber = getURLParameterByName("workordernum");
    return {
        workorderNumber
    }
};

const ImpactContainer = connect(mapStateToProps, {handleError, showError})(Impact);

export default withRouter(ImpactContainer)