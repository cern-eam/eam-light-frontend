import {connect} from 'react-redux'
import ApplicationLayout from './ApplicationLayout'

const mapStateToProps = (state) => {
    return {
        applicationData: state.application.applicationData
    }
};

const ApplicationLayoutContainer = connect(mapStateToProps)(ApplicationLayout);

export default ApplicationLayoutContainer