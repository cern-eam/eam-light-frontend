import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';

const DEFAULTS = {
    fullWidth: true,
    margin: 'dense',
};

const DEFAULT_NESTED_OBJECTS = {
    FormHelperTextProps: {},
    InputLabelProps: {
        shrink: true,
        style: {
            fontSize: '1.125rem',
            color: '#145886'
        }
    },
    InputProps: {},
    inputProps: {},
    SelectProps: {}
};

const generateCustomProps = (props) => {
    return {
        ...DEFAULTS,
        ...props,
        ...generateCustomNestedObjectProps(props)
    };
};


const generateCustomNestedObjectProps = (props) => {
    return Object.keys(DEFAULT_NESTED_OBJECTS).reduce((customObjectProps, defaultObjectKey) => {
        customObjectProps[defaultObjectKey] = {
            ...DEFAULT_NESTED_OBJECTS[defaultObjectKey],
            ...props[defaultObjectKey]
        };
        return customObjectProps;
    }, {});
};


export default class EAMTextField extends Component {
    render() {
        return (
            <TextField {...generateCustomProps(this.props)}></TextField>
        )
    }
}