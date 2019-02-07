import {connect} from 'react-redux'
import AssetSearch from './AssetSearch'
import {handleError} from "../../../../../actions/uiActions";

function mapStateToProps(state) {
    return {
        assetScreen: state.application.userData.screens[state.application.userData.assetScreen]
    }
}

const AssetSearchContainer = connect(mapStateToProps, {
    handleError
})(AssetSearch)

export default AssetSearchContainer