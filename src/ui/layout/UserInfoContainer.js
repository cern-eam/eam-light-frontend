import {connect} from 'react-redux'
import UserInfo from './UserInfo'
import {updateInforContext} from "../../actions/inforContextActions";
import {updateApplication} from "../../actions/applicationActions";
import { updateScannedUser } from "../../actions/scannedUserActions";

const mapStateToProps = (state) => {
    return {
        userData: state.application.userData,
        scannedUser: state.scannedUser,
    }
};

const UserInfoContainer = connect(mapStateToProps, {
    updateInforContext,
    updateApplication,
    updateScannedUser,
})(UserInfo);

export default UserInfoContainer