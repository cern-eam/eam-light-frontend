import React, {useState} from 'react';
import {areEqual} from './tools/input-tools'
import EAMBaseInput from './tools/EAMBaseInput';
import TextField from './tools/TextField';

const EAMTextField = (props) => {

    let {value, valueKey, updateProperty} = props;

    let inputProps = {
        onChange: (event) => updateProperty(valueKey, event.target.value),
        value: value
    };

    return (
        <EAMBaseInput {...props}>
            <TextField {...props} inputProps = {inputProps} />
        </EAMBaseInput>
    )

}

export default React.memo(EAMTextField, areEqual);