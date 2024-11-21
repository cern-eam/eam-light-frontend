import {connect} from 'react-redux';
import WorkorderSearch from './WorkorderSearch';
import {handleError} from "../../../../actions/uiActions";

const WorkorderSearchContainer = connect(null, {
    handleError
})(WorkorderSearch);

export default WorkorderSearchContainer;