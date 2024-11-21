import {connect} from 'react-redux'
import MeterReading from './MeterReading'
import {handleError, showError, showNotification} from '../../../actions/uiActions'

const MeterReadingContainer = connect(null, {
        showNotification,
        showError,
        handleError
    }
)(MeterReading);

export default MeterReadingContainer;