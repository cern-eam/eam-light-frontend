import {connect} from 'react-redux'
import {handleError, showError, showNotification} from '../../../../actions/uiActions'
import ReplaceEqp from "./ReplaceEqp";
import { withCernMode } from '../../../components/CERNMode';

function mapStateToProps(state) {
    return {
        userData: state.application.userData,
        equipmentLayout: state.application.assetLayout
    }
}

const ReplaceEqpContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError
    }
)(ReplaceEqp);

export default withCernMode(ReplaceEqpContainer);