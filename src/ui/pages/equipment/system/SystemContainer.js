import {connect} from 'react-redux';
import System from './System';
import {
    handleError, setLayoutProperty, showError, showNotification,
    toggleHiddenRegion
} from '../../../../actions/uiActions';

function mapStateToProps(state) {
    return {
        systemLayout: state.application.systemLayout,
        userData: state.application.userData,
        showEqpTree: state.ui.layout.showEqpTree,
        hiddenRegions: state.ui.hiddenRegions,
        eqp: state.ui.layout.equipment,
        applicationData: state.application.applicationData,
    }
}

const SystemContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError,
        setLayoutProperty,
        toggleHiddenRegion,
    }
)(System);

export default SystemContainer;