
export const UPDATE_SCANNED_USER = 'UPDATE_SCANNED_USER';

export function updateScannedUser(value) {
    return {
        type: UPDATE_SCANNED_USER,
        value
    }
}