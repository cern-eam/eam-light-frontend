import {connect} from 'react-redux'
import InstallEqp from './InstallEqp'
import {handleError, showError, showNotification, setLayoutProperty} from '../../../../actions/uiActions'

function mapStateToProps(state) {
    return {
        userData: state.application.userData
    }
}

const InstallEqpContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError,
        setLayoutProperty
    }
)(InstallEqp);

export default InstallEqpContainer;