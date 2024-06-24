import {connect} from 'react-redux'
import ComponentIframe from './ComponentIframe'
import { withCernMode } from 'eam-components/dist/tools/CERNMode'

function mapStateToProps(state) {
    return {
        url: state.application.applicationData.EL_DOCLI
    }
}

const EDMSDoclightIframeContainer = connect(
    mapStateToProps,
    {},
    (state, dispatch, own) => ({
        ...state, 
        ...dispatch,
        ...own,
        iframeTitle: 'DOCS',
        mode: 'write',
        profile: 'EAMLIGHT',
        collapsible: false,
        title: ''
    }),
)(ComponentIframe)

export default withCernMode(EDMSDoclightIframeContainer)