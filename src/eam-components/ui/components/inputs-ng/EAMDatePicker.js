import React, {useState} from 'react';
import {areEqual, renderDatePickerInput} from './tools/input-tools'
import EAMBaseInput from './tools/EAMBaseInput';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import enLocale from 'date-fns/locale/en-GB';

const EAMDatePicker = (props) => {

    let {value, valueKey, updateProperty} = props;
    let [isInvalidDate, setIsInvalidDate] = useState(false);

    const onChangeHandler = (newValue) => {
        try {
            updateProperty(valueKey, newValue.toISOString())
            setIsInvalidDate(false);
        } catch {
            setIsInvalidDate(true)
        }
    }

    return (
        <EAMBaseInput {...props}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
                <DatePicker
                    renderInput={(props) => renderDatePickerInput(props, isInvalidDate)}
                    value={value}
                    inputFormat="dd-MMM-yyyy"
                    onChange={onChangeHandler}
                />
         </LocalizationProvider>
        </EAMBaseInput>
    )

}

export default React.memo(EAMDatePicker, areEqual);