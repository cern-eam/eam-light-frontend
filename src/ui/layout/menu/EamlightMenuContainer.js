import {connect} from 'react-redux'
import EamlightMenu from './EamlightMenu'
import {
    updateAssetScreenLayout,
    updatePartScreenLayout,
    updatePositionScreenLayout,
    updateSystemScreenLayout,
    updateWorkOrderScreenLayout
} from '../../../actions/applicationActions'
import {
    showError,
    showNotification
} from '../../../actions/uiActions'

const mapStateToProps = (state) => {
    return {
        myOpenWorkOrders: state.workorder.myOpenWorkOrders,
        myTeamWorkOrders: state.workorder.myTeamWorkOrders,
        userData: state.application.userData
    }
};

const EamlightMenuContainer = connect(mapStateToProps, {
    updateWorkOrderScreenLayout,
    updateAssetScreenLayout,
    updatePositionScreenLayout,
    updateSystemScreenLayout,
    updatePartScreenLayout,
    showError,
    showNotification
})(EamlightMenu);

export default EamlightMenuContainer