import {connect} from 'react-redux'
import MeterReadingWO from './MeterReadingWO'
import {handleError, showError, showNotification} from '../../../../actions/uiActions'

const MeterReadingContainerWO = connect(null, {
        showNotification,
        showError,
        handleError
    }
)(MeterReadingWO);

export default MeterReadingContainerWO;