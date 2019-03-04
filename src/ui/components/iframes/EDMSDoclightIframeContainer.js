import {connect} from 'react-redux'
import EDMSDoclightIframe from './EDMSDoclightIframe'

function mapStateToProps(state) {
    return {
        edmsdoclightURL: state.application.applicationData.edmsdoclightURL
    }
}

const EDMSDoclightIframeContainer = connect(mapStateToProps)(EDMSDoclightIframe)

export default EDMSDoclightIframeContainer