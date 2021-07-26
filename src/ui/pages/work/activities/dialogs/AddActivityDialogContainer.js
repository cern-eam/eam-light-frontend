import { connect } from 'react-redux';
import AddActivityDialog from './AddActivityDialog';
import { handleError, showError, showNotification } from '../../../../../actions/uiActions';

const mapStateToProps = (state, ownProps) => {
    return {
        layout: state.application.workOrderLayout.tabs.ACT.fields,
    };
};

export default connect(mapStateToProps, {
    showNotification,
    showError,
    handleError,
})(AddActivityDialog);
