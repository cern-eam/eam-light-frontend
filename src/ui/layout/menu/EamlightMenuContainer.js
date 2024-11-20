import {connect} from 'react-redux'
import EamlightMenu from './EamlightMenu'
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
    showError,
    showNotification
})(EamlightMenu);

export default EamlightMenuContainer