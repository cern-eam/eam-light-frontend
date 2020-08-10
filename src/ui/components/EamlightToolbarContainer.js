import {connect} from 'react-redux'
import EamlightToolbar from './EamlightToolbar'

const mapStateToProps = (state) => {
    return {
        userData: state.application.userData
    }
};

const EamlightToolbarContainer = connect(mapStateToProps)(EamlightToolbar);

export default EamlightToolbarContainer