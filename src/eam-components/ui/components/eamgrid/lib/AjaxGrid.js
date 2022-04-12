import axios from 'axios';
import ErrorTypes from "./GridErrorTypes";

/*
 * Default timeout is 20s.
 * This can be overidden with the config object
 */
const DEFAULT_TIMEOUT = 20000;

class AjaxGrid {

  /**
   * Make a HTTP GET request
   */
  get(url, config = {}) {
    return (
      axios
        .get(url, {timeout: DEFAULT_TIMEOUT, ...config})
        .then(response => this._convertResponse(response))
        .catch(error => {throw this._convertError(error)})
    );
  }

  /**
   * Make a HTTP POST request
   */
  post(url, data, config = {}) {
    return (
      axios
        .post(url, data, config)
        .then(response => this._convertResponse(response))
        .catch(error => {throw this._convertError(error)})
    );
  }

  /**
   * Make a HTTP PUT request
   */
  put(url, data, config = {}) {
    return (
      axios
        .put(url, data, config)
        .then(response => this._convertResponse(response))
        .catch(error => {throw this._convertError(error)})
    );
  }

  /**
   * Make a HTTP DELETE request
   */
  delete(url, config = {}) {
    return (
      axios
        .delete(url, config)
        .then(response => this._convertResponse(response))
        .catch(error => {throw this._convertError(error)})
    );
  }

  /**
   * Convert Axios Response to our standard format
   * @param response
   * @returns {{status, body}}
   * @private
   */
  _convertResponse(response) {
    return {
      status: response.status,
      body: response.data
    }
  }

  /**
   * Convert Axios error to our standard format
   * @param error
   * @returns {{status: number, body: T}}
   * @private
   */
  _convertError(error) {
    if(axios.isCancel(error)) {
      return {
        type: ErrorTypes.REQUEST_CANCELLED
      }
    }

    if (error.response) {
      return {
        type: ErrorTypes.SERVER_ERROR,
        response: {
          status: error.response.status,
          body: error.response.data
        }
      }
    }
    else if (error.code === 'ECONNABORTED') {
      return {
        type: ErrorTypes.CONNECTION_ABORDED
      }
    }
    else {
      return {
        type: ErrorTypes.NETWORK_ERROR
      }
    }
  }

}

export default new AjaxGrid();