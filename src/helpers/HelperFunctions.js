export function formatShort(dateObj) {
    if (!dateObj) return 'N/A';

    const { YEAR, MONTH, DAY, HOUR, MINUTE, SECOND } = dateObj;

    const date = new Date(YEAR);

    date.setMonth(MONTH - 1); // Months are 0-indexed
    date.setDate(DAY);
    date.setHours(HOUR);
    date.setMinutes(MINUTE);
    date.setSeconds(SECOND);

    return date.toLocaleDateString('en-GB');
}

export async function batchRequests(items, batchSize, fn, onProgress) {
    const results = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);

        const batchResults = await Promise.all(
            batch.map(async (item) => {
                const result = await fn(item);
                onProgress(); // increment progress
                return result;
            })
        );

        results.push(...batchResults);
    }

    return results;
}

