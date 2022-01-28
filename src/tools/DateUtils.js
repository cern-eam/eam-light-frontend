import { addDays, differenceInDays, parse, format } from 'date-fns';
import Constants from 'eam-components/dist/enums/Constants';

export const shiftDate = (updateCallback, shiftKey, newValue, previousStartKey, previousEndKey, shiftStart = true) => {
    const shiftCallback = shiftStart ? shiftStartDate : shiftEndDate;
    updateCallback((prevValues) => ({
        ...prevValues,
        [shiftKey]: shiftCallback(newValue, prevValues[previousStartKey], prevValues[previousEndKey]),
    }));
};

export const shiftStartDate = (newEndDate, previousStartDate, previousEndDate) => {
    const { incomingDate, startDate, endDate } = parseDates(newEndDate, previousStartDate, previousEndDate);
    if (incomingDate > startDate) return format(startDate, Constants.DATE_FORMAT_VALUE);

    const diff = differenceInDays(incomingDate, endDate);
    return format(addDays(endDate, diff), Constants.DATE_FORMAT_VALUE);
};

export const shiftEndDate = (newStartDate, previousStartDate, previousEndDate) => {
    const { incomingDate, startDate, endDate } = parseDates(newStartDate, previousStartDate, previousEndDate);
    if (incomingDate < endDate) return format(endDate, Constants.DATE_FORMAT_VALUE);

    const diff = differenceInDays(incomingDate, startDate);
    return format(addDays(startDate, diff), Constants.DATE_FORMAT_VALUE);
};

const parseDates = (newDate, previousStartDate, previousEndDate) => {
    const timeRegex = /[0-9]*:[0-9]*/;
    const initialStartDate = previousStartDate.replace(timeRegex, '').trim();
    const initialEndDate = previousEndDate.replace(timeRegex, '').trim();

    const incomingDate = parse(newDate, Constants.DATE_FORMAT_VALUE, new Date());
    const startDate = parse(initialStartDate, Constants.DATE_FORMAT_VALUE, new Date());
    const endDate = parse(initialEndDate, Constants.DATE_FORMAT_VALUE, new Date());

    return { incomingDate, startDate, endDate };
}
