import {connect} from 'react-redux';
import WorkorderSearch from './WorkorderSearch';
import {handleError} from "../../../../actions/uiActions";

function mapStateToProps(state) {
    return {
        workOrderScreen: state.application.userData.screens[state.application.userData.workOrderScreen]
    }
}

const WorkorderSearchContainer = connect(mapStateToProps, {
    handleError
})(WorkorderSearch);

export default WorkorderSearchContainer;