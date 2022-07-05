import React, {useState} from 'react';
import {areEqual, renderDatePickerInput} from './tools/input-tools'
import EAMBaseInput from './tools/EAMBaseInput';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import enLocale from 'date-fns/locale/en-GB';

const EAMDateTimePicker = (props) => {

    let {value, valueKey, updateProperty} = props;

    return (
        <EAMBaseInput {...props}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
                <DateTimePicker
                    renderInput={renderDatePickerInput}
                    value={value}
                    disableMaskedInput
                    inputFormat="dd-MMM-yyyy HH:mm"
                    onChange={(newValue) => {updateProperty(valueKey, newValue.toISOString())}}
                    ampm={false}
                />
         </LocalizationProvider>
        </EAMBaseInput>
    )

}

export default React.memo(EAMDateTimePicker, areEqual);