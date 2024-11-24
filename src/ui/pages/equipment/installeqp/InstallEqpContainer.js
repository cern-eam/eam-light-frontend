import {connect} from 'react-redux'
import InstallEqp from './InstallEqp'
import {handleError, showError, showNotification} from '../../../../actions/uiActions'

const InstallEqpContainer = connect(null, {
        showNotification,
        showError,
        handleError
    }
)(InstallEqp);

export default InstallEqpContainer;