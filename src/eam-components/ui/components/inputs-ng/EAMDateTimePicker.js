import React, {useState} from 'react';
import {areEqual} from './tools/input-tools'
import {renderDatePickerInput, onChangeHandler} from './tools/date-tools'
import EAMBaseInput from './components/EAMBaseInput';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import enLocale from 'date-fns/locale/en-GB';

const EAMDateTimePicker = (props) => {

    let {value, valueKey, updateProperty} = props;
    let [isInvalidDate, setIsInvalidDate] = useState(false);

    return (
        <EAMBaseInput {...props}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
                <DateTimePicker
                    renderInput={(props) => renderDatePickerInput(props, isInvalidDate)}
                    value={value}
                    disableMaskedInput
                    inputFormat="dd-MMM-yyyy HH:mm" //TODO shouldn't be hardcoded 
                    onChange={onChangeHandler.bind(null, updateProperty, setIsInvalidDate, valueKey)}
                    ampm={false}
                />
         </LocalizationProvider>
        </EAMBaseInput>
    )

}

export default React.memo(EAMDateTimePicker, areEqual);