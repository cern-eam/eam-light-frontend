import {connect} from 'react-redux'
import ComponentIframe from './ComponentIframe'
import { withCernMode } from '../CERNMode'

const EDMSDoclightIframeContainer = connect(
    null,
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