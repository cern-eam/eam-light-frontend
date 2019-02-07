import { connect } from 'react-redux'
import EamlightMenu from './EamlightMenu'
import {updateWorkOrderScreenLayout,
        updateAssetScreenLayout,
        updatePositionScreenLayout,
        updateSystemScreenLayout,
        updatePartScreenLayout} from '../../../actions/applicationActions'

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
    updatePartScreenLayout
})(EamlightMenu);

export default EamlightMenuContainer