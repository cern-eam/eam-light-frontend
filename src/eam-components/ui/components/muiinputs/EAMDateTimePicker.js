import React from 'react';
import Constants from '../../../enums/Constants';
import EAMDatePickerBase from './EAMDatePickerBase';

export default class EAMDateTimePicker extends React.Component {

    render () {
        return (
            <EAMDatePickerBase 
                {...{
                    ...this.props, 
                    dateFormatValue: this.props.dateFormatValue || Constants.DATETIME_FORMAT_VALUE,
                    dateFormatDisplay: this.props.dateFormatDisplay || Constants.DATETIME_FORMAT_DISPLAY,
                    showTime: true
                }}
            />
        )
    }
}