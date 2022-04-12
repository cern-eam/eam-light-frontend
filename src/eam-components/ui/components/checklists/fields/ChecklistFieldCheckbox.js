import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';

const labelStyle = {
    root: {
        margin: 5
    },
    label: {
        fontSize: "0.95rem"
    }
};

const ChecklistFieldCheckbox = props => {
    const {code, desc, checked, handleChange, classes, disabled} = props;

    return <FormControlLabel
        classes={{root: classes.root,label: classes.label}}
        control={
            <Checkbox
                color="primary"
                checked={checked}
                onMouseDown={() => handleChange(code)}
                onTouchStart={() => handleChange(code)}
                disabled={disabled}/>
        }
        label={desc}
    />
};

export default withStyles(labelStyle)(ChecklistFieldCheckbox);