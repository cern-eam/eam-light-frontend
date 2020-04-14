import {connect} from 'react-redux'
import Asset from './Asset'
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    toggleHiddenRegion
} from '../../../../actions/uiActions'
import { isHiddenRegion, getUniqueRegionID } from '../../../../selectors/uiSelectors'

function mapStateToProps(state) {
    const entityScreenCode = state.application.userData.assetScreen;
    return {
        assetLayout: state.application.assetLayout,
        userData: state.application.userData,
        showEqpTree: state.ui.layout.showEqpTree,
        hiddenRegions: state.ui.hiddenRegions,
        isHiddenRegion: isHiddenRegion(state)(entityScreenCode),
        getUniqueRegionID: getUniqueRegionID(state)(entityScreenCode),
        eqp: state.ui.layout.equipment,
        applicationData: state.application.applicationData,
    }
}

const AssetContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError,
        setLayoutProperty,
        toggleHiddenRegion
    }
)(Asset)

export default AssetContainer