import axios from "axios";

export default class BaseHttpService {
  public token: null | string = null;

  async get(endpoint: string, options: object = {}) {
    Object.assign(options, this.getTokenHeaders());
    return axios.get(endpoint, options).catch(error => this.handleError(error));
  }

  async post(endpoint: string, options: object = {}) {
    Object.assign(options, this.getTokenHeaders());
    return axios
      .post(endpoint, options)
      .catch(error => this.handleError(error));
  }

  async delete(endpoint: string, options: object = {}) {
    Object.assign(options, this.getTokenHeaders());
    return axios
      .delete(endpoint, options)
      .catch(error => this.handleError(error));
  }

  async put(endpoint: string, options: object = {}) {
    Object.assign(options, this.getTokenHeaders());
    return axios.put(endpoint, options).catch(error => this.handleError(error));
  }

  async patch(endpoint: string, options: object = {}) {
    Object.assign(options, this.getTokenHeaders());
    return axios
      .patch(endpoint, options)
      .catch(error => this.handleError(error));
  }

  private getTokenHeaders(): object {
    return {
      headers: {
        Authorization: `bearer ${this.token}`
      }
    };
  }

  private handleError(error: any) {
    throw error;
  }
}
