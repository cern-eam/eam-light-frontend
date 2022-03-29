import { connect } from 'react-redux';
import { handleError, showError, showNotification } from '../../../../actions/uiActions';
import AdditionalCosts from "./AdditionalCosts";

function mapStateToProps(state) {
    return {
        userData: state.application.userData
    }
}

const AdditionalCostsContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError
    }
)(AdditionalCosts);

export default AdditionalCostsContainer;