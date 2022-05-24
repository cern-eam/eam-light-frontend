import {connect} from 'react-redux'
import ComponentIframe from './ComponentIframe'
import { withCernMode } from '../CERNMode'

function mapStateToProps(state) {
    return {
        edmsdoclightURL: `${state.application.applicationData.EL_TBURL}/ncr`,
    }
}

const NCRIframeContainer = connect(
    mapStateToProps,
    {},
    (state, dispatch, own) => ({
        ...state, 
        ...dispatch,
        ...own,
        mode: 'write',
        profile: 'EAMLIGHT',
        creationMode: 'NCR',
        options: {
            heightCalculationMethod: 'taggedElement'
        }
    })
)(ComponentIframe)

export default withCernMode(NCRIframeContainer)