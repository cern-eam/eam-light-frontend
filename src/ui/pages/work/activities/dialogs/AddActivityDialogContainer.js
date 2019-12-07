import {connect} from 'react-redux'
import AddActivityDialog from './AddActivityDialog'
import {createWorkOrderActivity} from '../../../../../actions/workorderActions';
import {handleError, showError, showNotification} from "../../../../../actions/uiActions";


const mapStateToProps = (state, ownProps) => {
  return {
    layout: state.application.workOrderLayout.tabs.ACT
  }
};

export default connect(
  mapStateToProps, {
      showNotification,
      showError,
      handleError}
)(AddActivityDialog);

