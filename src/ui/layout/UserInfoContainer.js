import { connect } from 'react-redux'
import UserInfo from './UserInfo'

const mapStateToProps = (state) => {
    return {
        userData: state.application.userData
    }
};

const UserInfoContainer = connect(mapStateToProps)(UserInfo);

export default UserInfoContainer


