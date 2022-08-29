import ErrorTypes from "eam-components/dist/enums/ErrorTypes";

export const SET_SNACKBAR_MESSAGE = 'SET_SNACKBAR_MESSAGE';
export const SET_LAYOUT = 'SET_LAYOUT';
export const TOGGLE_HIDDEN_REGION = 'TOGGLE_HIDDEN_REGION';
export const SET_REGION_VISIBILITY = 'SET_REGION_VISIBILITY';

export function showNotification(message, title = '') {
  return {
    type: SET_SNACKBAR_MESSAGE,
    snackbar: {
      title,
      message,
      type: 'success',
      open: true
    }
  }
}

export function showWarning(message, title = '') {
  return {
    type: SET_SNACKBAR_MESSAGE,
    snackbar: {
      title,
      message,
      type: 'warning',
      open: true
    }
  }
}

export function showError(message, title = '') {
  return {
    type: SET_SNACKBAR_MESSAGE,
    snackbar: {
      title,
      message,
      type: 'error',
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

export function setLayoutProperty(property, value) {
  return {
    type: SET_LAYOUT,
    layout: {
      [property]: value
    }
  }
}

export function toggleHiddenRegion(region) {
  return {
    type: TOGGLE_HIDDEN_REGION,
    region: region
  }
}

export function setRegionVisibility(region, isVisible) {
  return {
    type: SET_REGION_VISIBILITY,
    region: region,
    isVisible: isVisible
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
            let errorMessages = errors.reduce( (acc,value) => acc + '\n' + value.message, '')
            dispatch(showError(errorMessages))
              return errorMessages
          }
        }
        if (error.response.status === 503) {
            dispatch(showError('The Infor EAM Server seems to be down. Please contact CMMS Support.', 'No connection'))
        }
        break;
    }
  }
}
