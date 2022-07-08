import React from 'react';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import IconButton from '@mui/material/IconButton';

const Dependency = ({value, valueKey, updateProperty}) => {

    const isTrue = (value) => {
        const checkedTextValue = value || '';
        return checkedTextValue.toLowerCase() === true.toString();
    };

    
    return <div>
        <IconButton>
            {isTrue(value) && <LinkIcon onClick={() => updateProperty(valueKey, "false")}/>}
            {!isTrue(value) && <LinkOffIcon onClick={() => updateProperty(valueKey, "true")}/>}
        </IconButton>
    </div>;
}

export default Dependency;