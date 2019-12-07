import {connect} from 'react-redux'
import UserInfo from './UserInfo'
import {updateInforContext} from "../../actions/inforContextActions";
import {updateApplication} from "../../actions/applicationActions";

const mapStateToProps = (state) => {
    return {
        userData: state.application.userData
    }
};

const UserInfoContainer = connect(mapStateToProps, {
    updateInforContext,
    updateApplication
})(UserInfo);

export default UserInfoContainer