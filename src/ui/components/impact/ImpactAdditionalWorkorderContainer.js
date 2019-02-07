import {connect} from 'react-redux';
import {handleError} from "../../../actions/uiActions";
import ImpactAdditionalWorkorder from "./ImpactAdditionalWorkorder";

function mapStateToProps(state) {
    const workOrderScreenCode = state.application.userData.workOrderScreen;
    const workOrderScreen = state.application.userData.screens[workOrderScreenCode];
    return {
        workOrderScreen: workOrderScreen
    }
}

const ImpactAdditionalWorkorderContainer = connect(mapStateToProps, {
    handleError
})(ImpactAdditionalWorkorder);

export default ImpactAdditionalWorkorderContainer;