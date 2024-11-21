import {connect} from 'react-redux'
import EamlightMenu from './EamlightMenu'
import {
    showError,
    showNotification
} from '../../../actions/uiActions'

const EamlightMenuContainer = connect(null, {
    showError,
    showNotification
})(EamlightMenu);

export default EamlightMenuContainer