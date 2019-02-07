import { connect } from 'react-redux'
import AddActivityDialog from './AddActivityDialog'
import { createWorkOrderActivity } from '../../../../../actions/workorderActions';


const mapStateToProps = (state, ownProps) => {
  return {
    layout: state.application.workOrderLayout.tabs.ACT.fields
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleSave: activity => dispatch(createWorkOrderActivity(activity))
  }
};

export default connect(
  mapStateToProps, mapDispatchToProps
)(AddActivityDialog);

