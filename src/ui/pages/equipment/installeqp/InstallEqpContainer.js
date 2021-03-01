import {connect} from 'react-redux'
import InstallEqp from './InstallEqp'
import {handleError, showError, showNotification} from '../../../../actions/uiActions'

function mapStateToProps(state) {
    return {
        userData: state.application.userData
    }
}

const InstallEqpContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError
    }
)(InstallEqp);

export default InstallEqpContainer;