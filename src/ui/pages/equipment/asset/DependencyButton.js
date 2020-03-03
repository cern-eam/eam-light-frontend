import React, {useState, useEffect} from 'react';
import { IconButton } from '@material-ui/core';
import DeviceHubIcon from '@material-ui/icons/DeviceHub';


const DependencyButton = (props) => {

    const [value, setValue] = useState(props.value)

    let iconButtonStyle = {
        position: "absolute",
        top: props.top,
        right: props.right,
        width: 32,
        height: 32,
        zIndex: 100,
        padding: 0
    }

    useEffect(() => {
        props.updateProperty(props.valueKey, value)
    }, [value])

    return (
        <div style={{position: "relative"}}>
            {props.children}
            <IconButton style={iconButtonStyle} onClick={() => setValue(props.value === 'true' ? 'false' : 'true')}>
                <DeviceHubIcon color={ props.value === 'true' ? 'primary' : 'action' }/>
            </IconButton>
        </div>

)
}

export default DependencyButton