import {connect} from 'react-redux'
import EDMSWidget from './EDMSWidget'
import {handleError, showError, showSuccess} from '../../../actions/uiActions';

function mapStateToProps(state) {
    return {};
}

const EDMSWidgetContainer = connect(mapStateToProps, {
        showSuccess,
        showError,
        handleError
    }
)(EDMSWidget);

export default EDMSWidgetContainer;

// upgrade npm dependencies
// deployment to the cloud