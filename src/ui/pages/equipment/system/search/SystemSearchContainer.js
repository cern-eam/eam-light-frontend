import {connect} from 'react-redux'
import SystemSearch from './SystemSearch'
import {handleError} from "../../../../../actions/uiActions";

const SystemSearchContainer = connect(null, {
    handleError
})(SystemSearch)

export default SystemSearchContainer