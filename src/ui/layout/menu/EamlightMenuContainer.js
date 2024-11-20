import {connect} from 'react-redux'
import EamlightMenu from './EamlightMenu'
import {
    updateAssetScreenLayout,
    updatePartScreenLayout,
    updatePositionScreenLayout,
    updateSystemScreenLayout,
    updateWorkOrderScreenLayout,
    updateLocationScreenLayout
} from '../../../actions/applicationActions'
import {
    showError,
    showNotification
} from '../../../actions/uiActions'

const mapStateToProps = (state) => {
    return {
        myOpenWorkOrders: state.workorder.myOpenWorkOrders,
        myTeamWorkOrders: state.workorder.myTeamWorkOrders,
        userData: state.application.userData,
        applicationData: state.application.applicationData
    }
};

const EamlightMenuContainer = connect(mapStateToProps, {
    updateWorkOrderScreenLayout,
    updateAssetScreenLayout,
    updatePositionScreenLayout,
    updateSystemScreenLayout,
    updatePartScreenLayout,
    updateLocationScreenLayout,
    showError,
    showNotification
})(EamlightMenu);

export default EamlightMenuContainer