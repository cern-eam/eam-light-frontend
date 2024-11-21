import {connect} from 'react-redux'
import PartSearch from './PartSearch'
import {handleError} from "../../../../actions/uiActions";

const PartSearchContainer = connect(null, {
    handleError
})(PartSearch)

export default PartSearchContainer