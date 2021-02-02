import {connect} from 'react-redux'
import EDMSDoclightIframe from './EDMSDoclightIframe'
import { withCernMode } from '../CERNMode'

function mapStateToProps(state) {
    return {
        edmsdoclightURL: state.application.applicationData.EL_DOCLI
    }
}

const EDMSDoclightIframeContainer = connect(mapStateToProps)(EDMSDoclightIframe)

export default withCernMode(EDMSDoclightIframeContainer)