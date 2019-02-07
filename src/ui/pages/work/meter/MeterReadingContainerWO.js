import {connect} from 'react-redux'
import MeterReadingWO from './MeterReadingWO'
import {handleError, showError, showNotification} from '../../../../actions/uiActions'

function mapStateToProps(state) {
    return {
        userData: state.application.userData
    }
}

const MeterReadingContainerWO = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError
    }
)(MeterReadingWO);

export default MeterReadingContainerWO;