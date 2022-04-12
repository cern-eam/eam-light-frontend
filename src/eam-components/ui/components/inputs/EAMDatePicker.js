import React from 'react';
import {DatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import {Icon} from '@mui/material';
import EAMBaseInput, {formStyles} from './EAMBaseInput'
import DateFnsUtils from '@date-io/date-fns';
import EAMFormLabel from "./EAMFormLabel";
import withStyles from '@mui/styles/withStyles';
import {format} from "date-fns";
import parse from "date-fns/parse";
import Constants from '../../../enums/Constants';

const styles = theme => {
    const defaultStyles = formStyles(theme);
    return {
        ...defaultStyles,
        textFieldInput: {...defaultStyles.textFieldInput, padding: '0px 9px'}
    }
};

/**
 * DatePicker form field
 */
class EAMDatePicker extends EAMBaseInput {

    readValue(value) {
        if (value) {
            if (value instanceof Date)
                return value;
            if (value.length > 11)
                value = value.substring(0, 11);
            return parse(value, Constants.DATE_FORMAT_VALUE, new Date());
        } else {
            return null
        }
    }

    readDate(date) {
        if (date) {
            return format(date, Constants.DATE_FORMAT_VALUE);
        } else {
            return '';
        }
    }

    render() {
        if (this.isHidden()) {
            return <div/>
        }

        const {elementInfo, classes, label, labelStyle, valueKey, updateProperty, formFields, value, validate, ...other} = this.props;
        return (
            <div className={this.props.classes.fieldContainer}>

                <EAMFormLabel required={this.isRequired()}
                              label={label || (elementInfo && elementInfo.text)}
                              labelStyle={labelStyle} error={this.state.error}/>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker
                        inputadornmentprops={{style: {marginRight: -12}}}
                        keyboard="true"
                        error={this.state.error}
                        helperText={this.state.helperText}
                        disabled={this.state.disabled || (elementInfo && elementInfo.readonly)}
                        required={this.isRequired()}
                        clearable
                        value={this.readValue(this.props.value)}
                        onChange={date => this.onChangeHandler(valueKey, this.readDate(date))}
                        fullWidth
                        format={Constants.DATE_FORMAT_DISPLAY}
                        margin="normal"
                        className={this.props.classes.textFieldInput}
                        InputProps={{
                            disableUnderline: true,
                        }}
                        leftArrowIcon={<Icon> keyboard_arrow_left </Icon>}
                        rightArrowIcon={<Icon> keyboard_arrow_right </Icon>}
                        {...other}
                    />
                </MuiPickersUtilsProvider>
            </div>
        )
    }
}

export default withStyles(styles)(EAMDatePicker);

