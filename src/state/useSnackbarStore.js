import { create } from 'zustand';
import ErrorTypes from "eam-components/dist/enums/ErrorTypes"; 
import useInforContextStore from './useInforContext';

const useSnackbarStore = create((set, get) => ({
  snackbarData: {
    type: '',
    open: false,
    title: '',
    message: '',
  },
  showNotification: (message, title = '') =>
    set({
      snackbarData: {
        title,
        message,
        type: 'success',
        open: true,
      },
    }),
  showWarning: (message, title = '') =>
    set({
      snackbarData: {
        title,
        message,
        type: 'warning',
        open: true,
      },
    }),
  showError: (message, title = '') =>
    set({
      snackbarData: {
        title,
        message,
        type: 'error',
        open: true,
      },
    }),
  hideNotification: () => 
    set({
      snackbarData: {
        title: '',
        message: '',
        type: '',
        open: false,
      },
    }),
  handleError: (error) => {
    const { showError } = get();
    const { setInforContext } = useInforContextStore.getState();

    switch (error.type) {
      case ErrorTypes.CONNECTION_ABORDED:
        showError(
          'The server did not respond in a timely fashion. Please try again or check your internet connection.'
        );
        break;

      case ErrorTypes.NETWORK_ERROR:
        showError('The server could not be reached.');
        break;

      case ErrorTypes.SERVER_ERROR:
        if (error.response && error.response.body) {
          const errors = error.response.body.errors;
          if (errors && errors.length > 0) {
            const errorMessages = errors.reduce((acc, value) => acc + '\n' + value.message, '');

            if (errors.some(error => error.name === "com.dstm.mp.businessprocess.NoSessionException")) {
              setInforContext(null)
            }
           
            showError(errorMessages);
            return errorMessages;
          }
        }
        if (error.response.status === 503) {
          showError(
            'The Infor EAM Server seems to be down. Please contact CMMS Support.',
            'No connection'
          );
        }
        break;

      default:
        break;
    }
  },
}));

export default useSnackbarStore;
