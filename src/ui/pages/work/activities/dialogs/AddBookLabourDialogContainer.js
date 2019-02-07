import { connect } from 'react-redux'
import AddBookLabourDialog from './AddBookLabourDialog'
import { createBookLabour } from '../../../../../actions/workorderActions';


const mapStateToProps = (state, ownProps) => {
  return {
    user: state.application.userData,
    layout: state.application.workOrderLayout.tabs.BOO.fields
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleSave: bookLabour => dispatch(createBookLabour(bookLabour))
  }
};

export default connect(
  mapStateToProps, mapDispatchToProps
)(AddBookLabourDialog);

