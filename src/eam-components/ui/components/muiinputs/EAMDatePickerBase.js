import DateFnsUtils from '@date-io/date-fns';
import Icon from '@material-ui/core/Icon';
import { format } from 'date-fns';
import parse from "date-fns/parse";
import { DatePicker, DateTimePicker } from '@material-ui/pickers';
import PropTypes from 'prop-types';
import React from 'react';
import EAMBaseInput from './EAMBaseInput';
import EAMTextField from './EAMTextField';
import EventIcon from '@material-ui/icons/Event';
import { InputAdornment, IconButton } from "@material-ui/core";

const DefaultEndAdornment = props => (
    <InputAdornment position="end">
      {props.endAdornment ? props.endAdornment : ''}
      <IconButton size="small">
        <EventIcon />
      </IconButton>
    </InputAdornment>
)

export default class EAMDatePicker extends EAMBaseInput {

    init = props => {
        this.setValue(this.convert(props.value))
    }

    /** Always returns a Date from the value provided */
    readValue = value => 
            value instanceof Date ? value
            : typeof value === "string" && value.length ? parse(value.substring(0, this.props.dateFormatValue.length), this.props.dateFormatValue, new Date())
            : typeof value === "number" ? new Date(value)
            : null
            ;


    /* Reads the Date it receives to the format wanted (TIMESTAMP or FORMATTED STRING) */
    readDate = date =>
        !date ? (this.props.timestamp ? null : '')
            : this.props.timestamp ? date.getTime()
            : format(date, this.props.dateFormatValue)

    convert = value => this.readDate(this.readValue(value || ''))

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.value !== nextProps.value
            || this.state.error !== nextState.error
            || this.state.helperText !== nextState.helperText
            || this.state.disabled !== nextState.disabled
            || JSON.stringify(this.props.elementInfo || {}) !== JSON.stringify(nextProps.elementInfo || {});
    }

    componentDidUpdate() {
        let { value } = this.props;
        if (value instanceof Date
                || (typeof value === 'string' && this.props.timestamp)
                || (typeof value === 'number' && !this.props.timestamp)) {
            this.onChangeHandler(this.convert(value))
        }
    }

    getPickerProps (state, props) {
        const { elementInfo, dateFormatDisplay, value } = props;
        const { helperText, error, disabled } = state;
        return {
            inputadornmentprops: {style: {marginRight: -12}},
            error,
            helperText: helperText,
            disabled: disabled || (elementInfo && elementInfo.readonly),
            required: this.isRequired(),
            clearable: true,
            value: this.readValue(value), // Always formats the value. In EDGE and IE, the new Date() has a different behavior than in Chrome and Firefox
            onChange: str => this.onChangeHandler(this.convert(str)),
            format: dateFormatDisplay,
            label: elementInfo && elementInfo.text,
            leftArrowIcon: <Icon> keyboard_arrow_left </Icon>,
            rightArrowIcon: <Icon> keyboard_arrow_right </Icon>,
            TextFieldComponent: EAMTextField,
        }
    }

    renderComponent () {
        const { showTime, endAdornment } = this.props;

        const pickerProps = this.getPickerProps(this.state, this.props);
        
        return (showTime ? 
            <DateTimePicker
                {...pickerProps}
                ampm={false}
                InputProps={{
                    endAdornment: <DefaultEndAdornment endAdornment={endAdornment} />
                }}

            />
            : <DatePicker
                {...pickerProps}
                InputProps={{
                    endAdornment: <DefaultEndAdornment endAdornment={endAdornment} />
                }}
            />
        )
    }
}

EAMDatePicker.propTypes = {
    dateFormatDisplay: PropTypes.string.isRequired,
    dateFormatValue: PropTypes.string.isRequired,
    showTime: PropTypes.bool.isRequired
};

EAMDatePicker.defaultProps = {
    showTime: false
};