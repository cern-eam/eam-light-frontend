import {connect} from 'react-redux'
import ComponentIframe from './ComponentIframe'
import { withCernMode } from 'eam-components/dist/tools/CERNMode'

function mapStateToProps(state) {
    return {
        url: `${state.application.applicationData.EL_TBURL}/ncr`,
        edmsDocListLink: state.application.applicationData.EL_EDMSL,
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