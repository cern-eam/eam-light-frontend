import React from 'react';
import TextField from '@mui/material/TextField';
import EAMBaseInput, {formStyles} from './EAMBaseInput';
import withStyles from '@mui/styles/withStyles';
import EAMFormLabel from "./EAMFormLabel";
import InputAdornment from '@mui/material/InputAdornment';

class EAMInput extends EAMBaseInput {

    render() {
        // valueKey, updateProperty, rightAddon and formFields are destructured to not be included in the 'other' object
        // if we don't do this they will be passed to the html input and browser will complain about unknown attributes
        const {elementInfo, classes, label, labelStyle, disabled, valueKey, updateProperty, formFields, validate, rightAddon, startAdornment, endAdornment, ...other} = this.props;
        //Input props
        let inputProps = {style: {width: '100%'}, ...this.props.inputProps};
        //Type
        let inputType = this.props.type || 'string';

        if (this.isHidden()) {
            return <div/>
        }
        //Numeric
        if (elementInfo && (elementInfo.fieldType === 'number' || elementInfo.fieldType === 'currency')) {
            inputType = 'number';
        }
        //Classes
        let textClasses = '';
        if (this.props.rightAddon) {
            textClasses += classes.rightAddon + ' ';
        }
        if (this.state.error) {
            textClasses += classes.fieldInvalidInput;
        }

        // Right Addon. May come from elementInfo, and we can override with rightAddon property
        let rightAddonToDisplay;
        if (rightAddon) {
            rightAddonToDisplay = rightAddon;
        }
        else if (elementInfo) {
            rightAddonToDisplay = elementInfo.udfUom;
        }

        return (
            <div className={this.props.classes.fieldContainer}>
                <EAMFormLabel required={this.isRequired()} label={label || (elementInfo && elementInfo.text)}
                               labelStyle={labelStyle} error={this.state.error}/>
                <TextField
                    className={textClasses}
                    disabled={this.state.disabled || disabled || (elementInfo && elementInfo.readonly)}
                    error={this.state.error}
                    helperText={this.state.helperText}
                    required={this.isRequired()}
                    onChange={event => this.onChangeHandler(this.props.valueKey, event.target.value)}
                    fullWidth
                    margin="none"
                    {...other}
                    value={this.props.value !== undefined ? this.props.value : ''}
                    classes={{
                        root: classes.formControlRoot,
                    }}
                    inputProps={inputProps}
                    InputProps={{
                        classes: {
                            root: classes.textFieldRoot,
                            input: classes.textFieldInput
                        },
                        ...(startAdornment ?
                            {startAdornment: <InputAdornment position="start">{startAdornment}</InputAdornment>}
                            : {}),

                        ...(endAdornment ?
                            {endAdornment: <InputAdornment position="end">{endAdornment}</InputAdornment>}
                            : {}),
                    }}
                    InputLabelProps={{
                        shrink: true,
                        className: classes.textFieldFormLabel,
                    }}
                    type={inputType}
                />
                {rightAddonToDisplay &&
                <span className={classes.addon}>{rightAddonToDisplay}</span>
                }
            </div>
        )
    }
}

export default withStyles(formStyles)(EAMInput);
