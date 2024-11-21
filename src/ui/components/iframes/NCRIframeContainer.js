import {connect} from 'react-redux'
import ComponentIframe from './ComponentIframe'
import { withCernMode } from '../CERNMode'

const NCRIframeContainer = connect(
    null,
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