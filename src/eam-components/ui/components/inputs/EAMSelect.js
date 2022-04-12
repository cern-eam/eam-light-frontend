import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import EAMBaseInput, {formStyles} from './EAMBaseInput';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import EAMFormLabel from "./EAMFormLabel";
import classNames from 'classnames';

class EAMSelect extends EAMBaseInput {

    constructor(props) {
        super(props);
        let selectedObject = this._getSelectedObjectFromValue(props.value, props.values);
        this.state = {
            value: selectedObject
        };
    }

    componentDidMount() {
        //Set the reference
        if (this.props.refToReactSelect) {
            this.props.refToReactSelect(this.selectComponent);
        }
        //If there is only one value and the select is mandatory, then set the value
        const {elementInfo, values, value} = this.props;
        if (values && values.length === 1 && this.isRequired() && !value) {
            //Execute onChange with the first selection
            this.onChange(values[0]);
        }
    }

    onChange = (selectedObject) => {
        this.setState({
            value: selectedObject,
        }, () => {
            this.onChangeHandler(this.props.valueKey, selectedObject ? selectedObject.code : '', selectedObject);
        });
    };

    componentWillReceiveProps = (nextProps) => {
        if (!nextProps.value) {
            this.setState({
                value: undefined
            });
        } else {

            const selectedObject = this._getSelectedObjectFromValue(nextProps.value, nextProps.values);

            this.setState({
                value: selectedObject
            });
        }
    };

    _getSelectedObjectFromValue = (value, options) => {
        if (options) {
            const selectedObjects = options.filter(f => f.code === value);
            if (selectedObjects && selectedObjects.length === 1) {
                return selectedObjects[0];
            }
        }
        //If it is creatable, then return the value (if there is any)
        if (this.props.creatable && value) {
            return {code: value, desc: value};
        }
        return undefined;
    };


    onInputChange = input => {
        if (!this.props.autoSelectSingleResult) {
            return input;
        }

        const values = this.props.values;

        if (!values) {
            return input;
        }

        const filteredOptions = values.filter(option => {
            let valueTest = option.code;
            let labelTest = option.desc;

            if (!valueTest && !labelTest) {
                return false;
            }

            return (valueTest && valueTest.indexOf(input) >= 0) || (labelTest && labelTest.indexOf(input) >= 0);
        })

        if (filteredOptions.length === 1) {
            this.onChange(filteredOptions[0]);
        }
        return input;
    }

    render() {
        const {elementInfo, classes, values, value, valueKey, label, labelStyle, validate, forceSearchable, ...otherProps} = this.props;

        const searchable = window.innerWidth > 1000;
        const iOS = /iPad|iPhone/.test(navigator.userAgent) && !window.MSStream;

        if (this.isHidden()) {
            return <div/>
        }

        const SelectComponent = this.props.creatable
            ? Select.Creatable
            : Select;

        const selectClasses = this.props.selectStyle ? classNames(classes.select, this.props.selectStyle) : classes.select;

        return (
            <div className={classes.fieldContainer}>
                <EAMFormLabel required={this.isRequired()} label={label || (elementInfo && elementInfo.text)}
                              labelStyle={labelStyle} error={this.state.error}/>
                <SelectComponent
                    ref={!this.props.creatable ? ref => this.selectComponent = ref : undefined}
                    required={this.isRequired()}
                    disabled={this.state.disabled || (elementInfo && elementInfo.readonly)}
                    value={this.state.value}
                    onChange={this.onChange}
                    onInputChange={this.onInputChange}
                    options={values}
                    valueKey="code"
                    labelKey="desc"
                    className={!this.state.error ? selectClasses : `${selectClasses} ${classes.fieldInvalid}`}
                    placeholder={this.props.placeholder}
                    clearable={true}
                    resetValue=''
                    searchable={forceSearchable || (!iOS && searchable)}
                    autoBlur
                    {...otherProps}
                />
                {this.state.helperText && this.renderHelperText()}
            </div>
        )
    }
}

EAMSelect.propTypes = {
    labelStyle: PropTypes.object,
    creatable: PropTypes.bool,
    forceSearchable: PropTypes.bool,
    autoSelectSingleResult: PropTypes.bool
};

EAMSelect.defaultProps = {
    autoSelectSingleResult: false,
    placeholder: ''
}

export default withStyles(formStyles)(EAMSelect);