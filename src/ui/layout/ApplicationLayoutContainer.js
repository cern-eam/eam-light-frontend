import { connect } from 'react-redux';
import { handleError, showNotification } from "../../actions/uiActions";
import { updateScannedUser } from '../../actions/scannedUserActions';
import ApplicationLayout from './ApplicationLayout';

const mapStateToProps = (state) => {
    return {
        scannedUser: state.scannedUser,
    }
};

const ApplicationLayoutContainer = connect(mapStateToProps, {updateScannedUser, showNotification, handleError})(ApplicationLayout);

export default ApplicationLayoutContainer;