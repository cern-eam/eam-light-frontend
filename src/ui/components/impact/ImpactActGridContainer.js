import {connect} from 'react-redux';
import {handleError} from "../../../actions/uiActions";
import ImpactActGrid from "./ImpactActGrid";

function mapStateToProps(state) {
    return {
        applicationData: state.application.applicationData
    }
}

const ImpactActGridContainer = connect(mapStateToProps, {
    handleError
})(ImpactActGrid);

export default ImpactActGridContainer;