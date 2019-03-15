import {connect} from 'react-redux'
import Asset from './Asset'
import {showNotification, showError, handleError, setLayoutProperty} from '../../../../actions/uiActions'
import {toggleHiddenRegion} from "../../../../actions/uiActions";

function mapStateToProps(state) {
    return {
        assetLayout: state.application.assetLayout,
        userData: state.application.userData,
        showEqpTree: state.ui.layout.showEqpTree,
        hiddenRegions: state.ui.hiddenRegions,
        eqp: state.ui.layout.equipment,
        applicationData: state.application.applicationData,
    }
}

const AssetContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError,
        setLayoutProperty,
        toggleHiddenRegion,
    }
)(Asset)

export default AssetContainer