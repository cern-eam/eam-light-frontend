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
        mode: 'write',
        profile: 'EAMLIGHT',
        edmsdoclightURL: `${process.env.REACT_APP_TOOLBOX_URL}/ncr`,
        creationMode: 'NCR',
        options: {
            heightCalculationMethod: 'taggedElement'
        }
    })
)(ComponentIframe)

export default withCernMode(NCRIframeContainer)