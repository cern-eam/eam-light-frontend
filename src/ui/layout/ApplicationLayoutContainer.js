import { connect } from 'react-redux';
import { handleError, showNotification } from "../../actions/uiActions";
import { updateScannedUser } from '../../actions/scannedUserActions';
import ApplicationLayout from './ApplicationLayout';

const mapStateToProps = (state) => {
    return {
        applicationData: state.application.applicationData,
        scannedUser: state.scannedUser,
        userData: state.application.userData,
    }
};

const ApplicationLayoutContainer = connect(mapStateToProps, {updateScannedUser, showNotification, handleError})(ApplicationLayout);

export default ApplicationLayoutContainer;