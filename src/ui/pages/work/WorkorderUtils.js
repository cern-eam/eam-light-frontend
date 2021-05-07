import {addDays, differenceInDays, parse, format} from 'date-fns'
import Constants from 'eam-components/dist/enums/Constants';

export const createScheduleValue = ({ value, startValue, startKey, endValue, endKey }) => {
    const timeRegex = /[0-9]*:[0-9]*/;
    const initialStartDate = (startValue || value).replace(timeRegex, '').trim();
    const initialEndDate = endValue.replace(timeRegex, '').trim();

    const incomingStartDate = parse(value, Constants.DATE_FORMAT_VALUE, new Date());
    const startDate = parse(initialStartDate, Constants.DATE_FORMAT_VALUE, new Date());
    const endDate = parse(initialEndDate, Constants.DATE_FORMAT_VALUE, new Date());

    const diff = differenceInDays(incomingStartDate, startDate);
    const newEndValue = format(addDays(endDate, diff), Constants.DATE_FORMAT_VALUE);

    return {
        [startKey]: value,
        [endKey]: newEndValue
    };
}