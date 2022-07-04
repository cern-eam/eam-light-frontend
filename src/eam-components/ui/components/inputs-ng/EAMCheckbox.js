import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import EAMBaseInput from './tools/EAMBaseInput';
import { areEqual } from './tools/input-tools';


const EAMCheckbox = (props) => {
    
    const { 
        value, 
        valueKey,
        updateProperty} = props;

    const isChecked = (value) => {
        const checkedTextValue = value || '';
        return checkedTextValue.toLowerCase() === true.toString();
    };

    const handleChange = (event, checked) => {
        updateProperty(valueKey, checked.toString());
    };


    return (
        <EAMBaseInput {...props}>
            <Checkbox
                style={{marginLeft: -11}}
                color="primary"
                checked={isChecked(value)}
                onChange={handleChange}
            />
        </EAMBaseInput>
    );
}

export default React.memo(EAMCheckbox, areEqual);