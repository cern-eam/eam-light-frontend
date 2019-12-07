import {connect} from 'react-redux'
import Login from './Login'
import {handleError, showError, showNotification} from '../../../actions/uiActions'
import {updateInforContext} from "../../../actions/inforContextActions";

function mapStateToProps(state) {
    return {
        inforContext: state.inforContext
    }
}

const LoginContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError,
        updateInforContext
    }
)(Login)

export default LoginContainer
