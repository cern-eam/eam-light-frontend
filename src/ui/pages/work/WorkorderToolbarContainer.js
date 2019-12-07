import {connect} from 'react-redux'
import WorkorderToolbar from './WorkorderToolbar'

const mapStateToProps = (state, ownProps) => {
  return {
      applicationData: state.application.applicationData,
      screencode: state.application.userData.workOrderScreen.screenCode
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

const WorkorderToolbarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkorderToolbar);

export default WorkorderToolbarContainer
