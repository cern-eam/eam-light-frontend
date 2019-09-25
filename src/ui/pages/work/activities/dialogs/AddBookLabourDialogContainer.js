import { connect } from 'react-redux'
import AddBookLabourDialog from './AddBookLabourDialog'
import { createBookLabour } from '../../../../../actions/workorderActions';
import {handleError, showError, showNotification} from "../../../../../actions/uiActions";


const mapStateToProps = (state, ownProps) => {
  return {
    user: state.application.userData,
    layout: state.application.workOrderLayout.tabs.BOO
  }
};



export default connect(mapStateToProps, {
  showNotification,
  showError,
  handleError}
)(AddBookLabourDialog);

