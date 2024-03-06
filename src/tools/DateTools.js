import {format, parse, parseISO} from 'date-fns'

/**
 * 
 * @param {string | number | Date} date if string, must be of ISO format, YYYY-MM-DD HH:mm:ss (Infor format), or of UNIX timestamp as string
 * @param {boolean | undefined} showTime optional, include time in returned date
 * @returns a date of format DD-LLL-YYYY [HH:mm:ss] eg. 01-Jan-2000
 */
export const formatConsistentDate = (date, showTime) => {
    if (!date) {
        return;
    }

    let parsedDate = date;

    // If arg is a string
    if (typeof date === "string") {
        // If arg is a locale formatted date
        if (date.indexOf('-') !== -1) {
            parsedDate = parse(date, "yyyy-LL-dd' 'HH:mm:ss'.0'", new Date())
        }
        else if (date.indexOf('T') !== -1) {
            // 
            parsedDate = parseISO(date)
        } 
        else {
            // Assume arg is a UNIX timestamp as a string, and parse to int
            parsedDate = parseInt(date)
        }
    }

    return format(parsedDate, `dd-LLL-yyyy${showTime ? " HH:mm:ss" : ""}`)
}