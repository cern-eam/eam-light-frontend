import {connect} from 'react-redux'
import EamlightFooter from './EamlightFooter'

const mapStateToProps = (state) => {
    return {
        userData: state.application.userData
    }
};

const EamlightFooterContainer = connect(mapStateToProps)(EamlightFooter);

export default EamlightFooterContainer