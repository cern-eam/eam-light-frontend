import {connect} from 'react-redux'
import EAMTree from './EAMTree'
import {handleError} from '../../../actions/uiActions'

const EAMTreeContainer = connect(null, {
        handleError
    }
)(EAMTree);

export default EAMTreeContainer;