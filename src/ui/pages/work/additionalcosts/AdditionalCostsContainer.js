import { connect } from 'react-redux';
import { handleError, showError, showNotification } from '../../../../actions/uiActions';
import AdditionalCosts from "./AdditionalCosts";


const AdditionalCostsContainer = connect(null, {
        showNotification,
        showError,
        handleError
    }
)(AdditionalCosts);

export default AdditionalCostsContainer;