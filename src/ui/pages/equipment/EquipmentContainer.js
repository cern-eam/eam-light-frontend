import {connect} from 'react-redux'
import Equipment from './Equipment'
import {withRouter} from "react-router-dom";
import {setLayoutProperty} from "../../../actions/uiActions";

function mapStateToProps(state) {
    return {
        showEqpTree: state.ui.layout.showEqpTree
    }
}

const EquipmentContainer = connect(mapStateToProps, {
        setLayoutProperty
    }
)(Equipment)

export default withRouter(EquipmentContainer)