import React from 'react';
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import {Icon} from '@mui/material';
import EAMBaseInput, {formStyles} from './EAMBaseInput'
import {format} from 'date-fns'
import DateFnsUtils from '@date-io/date-fns';
import parse from 'date-fns/parse';
import EAMFormLabel from "./EAMFormLabel";
import withStyles from '@mui/styles/withStyles';

const styles = theme => {
    const defaultStyles = formStyles(theme);
    return {
        ...defaultStyles,
        textFieldInput: {...defaultStyles.textFieldInput, padding: '0px 9px'}
    }
};

/**
 * DateTimePicker form field
 */
class EAMDateTimePicker extends EAMBaseInput {

    readValue(value) {
        if (value) {
            if (value instanceof Date) {
                return value;
            }

            return parse(value, Constants.DATETIME_FORMAT_VALUE, new Date());
        } else {
            return null
        }
    }

    readDate(date) {
        if (date) {
            return format(date, Constants.DATETIME_FORMAT_VALUE)
        } else {
            return ''
        }
    }

    render() {
        var {text} = this.props.elementInfo;

        if (this.isHidden()) {
            return <div/>
        }
        const {labelStyle, elementInfo, label, validate} = this.props;
        return (
            <div className={this.props.classes.fieldContainer}>
                <EAMFormLabel required={this.isRequired()} label={label || (elementInfo && elementInfo.text)}
                               labelStyle={labelStyle} error={this.state.error}/>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                        inputadornmentprops={{style: {marginRight: -12}}}
                        keyboard="true"
                        error={this.state.error}
                        helperText={this.state.helperText}
                        disabled={this.state.disabled || this.props.elementInfo.readonly}
                        required={this.isRequired()}
                        clearable
                        value={this.readValue(this.props.value)}
                        onChange={date => this.onChangeHandler(this.props.valueKey, this.readDate(date))}
                        fullWidth
                        className={this.props.classes.textFieldInput}
                        InputProps={{
                            disableUnderline: true,
                        }}
                        format={Constants.DATETIME_FORMAT_DISPLAY}
                        margin="normal"
                        leftArrowIcon={<Icon> keyboard_arrow_left </Icon>}
                        rightArrowIcon={<Icon> keyboard_arrow_right </Icon>}
                    />
                </MuiPickersUtilsProvider>
            </div>
        )
    }
}


export default withStyles(styles)(EAMDateTimePicker);