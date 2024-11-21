import {connect} from 'react-redux'
import Eamlight from './Eamlight'

const mapStateToProps = (state) => {
    return {
        inforContext: state.inforContext,
        showEqpTree: state.ui.layout.showEqpTree
    }
};

const EamlightContainer = connect(mapStateToProps, {})(Eamlight);

export default EamlightContainer