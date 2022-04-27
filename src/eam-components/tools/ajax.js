import axios from 'axios';
import ErrorTypes from "../enums/ErrorTypes";

/*
 * Default timeout is 20s.
 * This can be overidden with the config object
 */
const DEFAULT_TIMEOUT = 20000;

class Ajax {


  /**
   * @returns the static Axios instance exported by 'axios'
   */
  getAxiosInstance = () => axios

  /**
   * Make a HTTP GET request
   */
  get = (url, config = {}) =>
      axios
        .get(url, config)
        .then(response => this.#convertResponse(response))
        .catch(error => {throw this.#convertError(error)})
    
  
  /**
   * Make a HTTP POST request
   */
  post = (url, data, config = {}) => 
      axios
        .post(url, data, config)
        .then(response => this.#convertResponse(response))
        .catch(error => {throw this.#convertError(error)})
    
  
  /**
   * Make a HTTP PUT request
   */
  put = (url, data, config = {}) => 
      axios
        .put(url, data, config)
        .then(response => this.#convertResponse(response))
        .catch(error => {throw this.#convertError(error)})


  /**
   * Make a HTTP DELETE request
   */
  delete = (url, config = {}) => 
      axios
        .delete(url, config)
        .then(response => this.#convertResponse(response))
        .catch(error => {throw this.#convertError(error)})


  /**
   * Convert Axios Response to our standard format
   * @param response
   * @returns {{status, body}}
   * @private
   */
  #convertResponse = (response) => ({ status: response.status, body: response.data })
  
  /**
   * Convert Axios error to our standard format
   * @param error
   * @returns {{status: number, body: T}}
   * @private
   */
  #convertError = (error) => {
      if (axios.isCancel(error)) {
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

      if (error.code === 'ECONNABORTED') {
          return {
              type: ErrorTypes.CONNECTION_ABORDED
          }
      }

      // Because we are behind IT-DB proxy this will be only reached when a redirect was sent (i.e. SSO session has expired)
      // TODO: should be carefully studied
      // window.location.reload(true)
  }
}

export default new Ajax();