import {connect} from 'react-redux'
import UserInfo from './UserInfo'
import {updateInforContext} from "../../actions/inforContextActions";
import { updateScannedUser } from "../../actions/scannedUserActions";

const mapStateToProps = (state) => {
    return {
        scannedUser: state.scannedUser,
    }
};

const UserInfoContainer = connect(mapStateToProps, {
    updateInforContext,
    updateScannedUser,
})(UserInfo);

export default UserInfoContainer