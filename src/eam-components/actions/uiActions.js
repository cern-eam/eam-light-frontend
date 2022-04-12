import ErrorTypes from "../enums/ErrorTypes";

export const SET_SNACKBAR_MESSAGE = 'SET_SNACKBAR_MESSAGE';
export const SET_CONFIRM_DIALOG = 'SET_CONFIRM_DIALOG';

export function showSuccess(message, title = '', autoHideDuration = 4000) {
    return {
        type: SET_SNACKBAR_MESSAGE,
        snackbar: {
            title,
            message,
            autoHideDuration,
            type: 'success',
            open: true
        }
    }
}

export function showError(message, title = '', autoHideDuration = 4000) {
    return {
        type: SET_SNACKBAR_MESSAGE,
        snackbar: {
            title,
            message,
            autoHideDuration,
            type: 'error',
            open: true
        }
    }
}

export function showWarning(message, title = '', autoHideDuration = 4000) {
    return {
        type: SET_SNACKBAR_MESSAGE,
        snackbar: {
            title,
            message,
            autoHideDuration,
            type: 'warning',
            open: true
        }
    }
}

export function hideNotification() {
    return {
        type: SET_SNACKBAR_MESSAGE,
        snackbar: {
            title: '',
            message: '',
            type: '',
            open: false
        }
    }
}

export function openConfirmDialog(dialog = {},
                                  confirmHandler,
                                  cancelHandler) {
    return {
        type: SET_CONFIRM_DIALOG,
        confirmDialog: {
            ...dialog,
            confirmHandler,
            cancelHandler,
            open: true
        }
    }
}

export function closeConfirmDialog() {
    return {
        type: SET_CONFIRM_DIALOG,
        confirmDialog: {
            open: false
        }
    }
}

/**
 * Display an error message based on an exception
 * @param error
 * @returns {function(*)}
 */
export function handleError(error) {
    return (dispatch) => {
        switch (error.type) {
            case ErrorTypes.CONNECTION_ABORDED:
                dispatch(showError("The server did not respond in a timely fashion. Please try again or check your internet connection."));
                break;

            case ErrorTypes.NETWORK_ERROR:
                dispatch(showError("The server could not be reached."));
                break;

            case ErrorTypes.SERVER_ERROR:
                if (error.response && error.response.body) {
                    const errors = error.response.body.errors;
                    if (errors && errors.length > 0) {
                        dispatch(showError(errors[0].message))
                    }
                }
                break;
        }
    }
}
