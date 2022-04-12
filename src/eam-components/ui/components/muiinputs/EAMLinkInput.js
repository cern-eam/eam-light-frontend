import React, {Component} from 'react';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from 'mdi-material-ui/OpenInNew'
import { Link } from 'react-router-dom'

class EAMLinkInput extends Component {

        render() {
            // No value, no link
            if (!this.props.value) {
                return this.props.children
            }

            let iconButtonStyle = {
                position: "absolute",
                top: this.props.top || 30,
                right: this.props.right || -2,
                backgroundColor: "white",
                width: 32,
                height: 32,
                zIndex: 100,
                padding: 0
            }

            const EAMLink = props => <Link to={process.env.REACT_APP_FRONTEND + this.props.link + this.props.value}  {...props} />

            return (
                <div style={{position: "relative"}}>
                    {this.props.children}

                    <IconButton style={iconButtonStyle} component={EAMLink} size="large">
                        {this.props.icon}
                    </IconButton>
                </div>
            );
    } 

}

EAMLinkInput.defaultProps = {
    icon: <OpenInNewIcon/> 
}

export default EAMLinkInput