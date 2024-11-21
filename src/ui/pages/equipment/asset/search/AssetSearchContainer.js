import {connect} from 'react-redux'
import AssetSearch from './AssetSearch'
import {handleError} from "../../../../../actions/uiActions";

const AssetSearchContainer = connect(null, {
    handleError
})(AssetSearch)

export default AssetSearchContainer