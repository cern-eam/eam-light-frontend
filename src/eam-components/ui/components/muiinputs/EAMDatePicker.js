import React from 'react';
import Constants from '../../../enums/Constants';
import EAMDatePickerBase from './EAMDatePickerBase';

export default class EAMDatePicker extends React.Component {

    render () {
        return (
            <EAMDatePickerBase 
                {...{
                    ...this.props, 
                    dateFormatValue: this.props.dateFormatValue || Constants.DATE_FORMAT_VALUE,
                    dateFormatDisplay: this.props.dateFormatDisplay || Constants.DATE_FORMAT_DISPLAY,
                    showTime: false
                }}
            />
        )
    }
}