import {connect} from 'react-redux'
import ComponentIframe from './ComponentIframe'
import { withCernMode } from '../CERNMode'

function mapStateToProps(state) {
    return {
         // TODO: add as app setting on r5install
    }
}

const NCRIframeContainer = connect(
    mapStateToProps,
    {},
    (state, dispatch, own) => ({
        ...state, 
        ...dispatch,
        ...own,
        iframeTitle: 'NCR',
        mode: 'write',
        profile: 'EAMLIGHT',
        collapsible: false,
        edmsdoclightURL: "http://localhost:3007/ncr",
        creationMode: 'NCR'
    })
)(ComponentIframe)

export default withCernMode(NCRIframeContainer)