import {connect} from 'react-redux'
import Eamlight from './Eamlight'

const mapStateToProps = (state) => {
    return {
        inforContext: state.inforContext,
    }
};

const EamlightContainer = connect(mapStateToProps, {})(Eamlight);

export default EamlightContainer