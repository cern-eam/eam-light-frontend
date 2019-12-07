import {connect} from 'react-redux';
import Part from './Part';
import {
    handleError,
    setLayoutProperty,
    showError,
    showNotification,
    toggleHiddenRegion
} from '../../../actions/uiActions';

function mapStateToProps(state) {
    return {
        partLayout: state.application.partLayout,
        hiddenRegions: state.ui.hiddenRegions,
        userData: state.application.userData,
        applicationData: state.application.applicationData
    }
}

const PartContainer = connect(mapStateToProps, {
        showNotification,
        showError,
        handleError,
        setLayoutProperty,
        toggleHiddenRegion,
    }
)(Part);

export default PartContainer;