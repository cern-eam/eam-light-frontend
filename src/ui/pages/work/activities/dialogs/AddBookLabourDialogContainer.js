import {connect} from 'react-redux'
import AddBookLabourDialog from './AddBookLabourDialog'
import {handleError, showError, showNotification} from "../../../../../actions/uiActions";

export default connect(null, {
  showNotification,
  showError,
  handleError}
)(AddBookLabourDialog);

