import { connect } from 'react-redux'
import UserInfo from './UserInfo'
import {updateInforContext} from "../../actions/inforContextActions";

const mapStateToProps = (state) => {
    return {
        userData: state.application.userData
    }
};

const UserInfoContainer = connect(mapStateToProps, {
    updateInforContext
})(UserInfo);

export default UserInfoContainer