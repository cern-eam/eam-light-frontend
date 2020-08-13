import {connect} from 'react-redux'
import EamlightToolbar from './EamlightToolbar'
import { applicationGetters } from '../../reducers/applicationReducers';

const mapStateToProps = (state) => {
    return {
        isLocalAdministrator: applicationGetters(state.application).isLocalAdministrator()
    }
};

const EamlightToolbarContainer = connect(mapStateToProps)(EamlightToolbar);

export default EamlightToolbarContainer