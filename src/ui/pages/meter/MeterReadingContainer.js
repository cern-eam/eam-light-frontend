import {connect} from 'react-redux'
import MeterReading from './MeterReading'
import {handleError, showError, showNotification} from '../../../actions/uiActions'

function mapStateToProps(state) {
    return {
        userData: state.application.userData
    }
}

const MeterReadingContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError
    }
)(MeterReading);

export default MeterReadingContainer;