import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import EAMBaseInput from './components/EAMBaseInput';
import { areEqual } from './tools/input-tools';


const rootStyle = {
    //width: "calc(50% - 20px)",
    //boxSizing: "border-box",
    //float: "left",
    width: "auto",
    flex: "1 1 170px",
    flexFlow: "row nowrap"
}

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
        <EAMBaseInput {...props} rootStyle={rootStyle}>
            <Checkbox
                style={{boxSizing: "border-box"}}
                color="primary"
                checked={isChecked(value)}
                onChange={handleChange}
            />
        </EAMBaseInput>
    );
}

export default React.memo(EAMCheckbox, areEqual);