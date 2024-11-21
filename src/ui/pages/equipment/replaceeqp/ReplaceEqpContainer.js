import {connect} from 'react-redux'
import {handleError, showError, showWarning, showNotification} from '../../../../actions/uiActions'
import ReplaceEqp from "./ReplaceEqp";
import { withCernMode } from '../../../components/CERNMode';

const ReplaceEqpContainer = connect(null, {
        showNotification,
        showError,
        showWarning,
        handleError
    }
)(ReplaceEqp);

export default withCernMode(ReplaceEqpContainer);