import {connect} from 'react-redux'
import EAMTree from './EAMTree'
import {handleError, setLayoutProperty} from '../../../actions/uiActions'

function mapStateToProps(state) {
    return {
        layout: state.ui.layout
    }
}

const EAMTreeContainer = connect(mapStateToProps,
    {
        handleError,
        setLayoutProperty
    }
)(EAMTree);

export default EAMTreeContainer;