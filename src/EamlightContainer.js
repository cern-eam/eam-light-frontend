import {connect} from 'react-redux'
import Eamlight from './Eamlight'
import {initializeApplication} from "./actions/actions";

const mapStateToProps = (state) => {
    return {
        inforContext: state.inforContext,
        userData: state.application.userData,
        applicationData: state.application.applicationData,
    }
};

const EamlightContainer = connect(mapStateToProps, {initializeApplication})(Eamlight);

export default EamlightContainer