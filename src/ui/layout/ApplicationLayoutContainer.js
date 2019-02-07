import { connect } from 'react-redux'
import { withRouter } from "react-router-dom";
import ApplicationLayout from './ApplicationLayout'
import {setLayoutProperty} from '../../actions/uiActions'

const mapStateToProps = (state) => {
    return {
        showEqpTreeButton: state.ui.layout.showEqpTreeButton,
        showEqpTree: state.ui.layout.showEqpTree,
        eqp: state.ui.layout.equipment
    }
};

const ApplicationLayoutContainer = connect(mapStateToProps, {
    setLayoutProperty
})(ApplicationLayout);

export default withRouter(ApplicationLayoutContainer)