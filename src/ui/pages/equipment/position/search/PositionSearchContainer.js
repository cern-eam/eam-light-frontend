import {connect} from 'react-redux';
import PositionSearch from './PositionSearch';
import {handleError} from "../../../../../actions/uiActions";

const PositionSearchContainer = connect(null, {
    handleError
})(PositionSearch)

export default PositionSearchContainer