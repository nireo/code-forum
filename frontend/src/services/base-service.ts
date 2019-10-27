import axios from "axios";

export default class BaseHttpService {
    public token: null | string = null;

    // the 'Object.assign' is used to add other parameters, if needed
    // otherwise it adds the token headers by default.

    async get(endpoint: string, options: object = {}) {
        Object.assign(options, this.getTokenHeaders());
        const response = await axios
            .get(endpoint, options)
            .catch(error => this.handleError(error));
        return response.data;
    }

    async post(endpoint: string, options: object = {}) {
        Object.assign(options, this.getTokenHeaders());
        const response = await axios
            .post(endpoint, options)
            .catch(error => this.handleError(error));
        return response.data;
    }

    async delete(endpoint: string, options: object = {}) {
        Object.assign(options, this.getTokenHeaders());
        const response = await axios
            .delete(endpoint, options)
            .catch(error => this.handleError(error));
        return response.data;
    }

    async put(endpoint: string, options: object = {}) {
        Object.assign(options, this.getTokenHeaders());
        const response = await axios
            .put(endpoint, options)
            .catch(error => this.handleError(error));
        return response.data;
    }

    async patch(endpoint: string, options: object = {}) {
        Object.assign(options, this.getTokenHeaders());
        const response = await axios
            .patch(endpoint, options)
            .catch(error => this.handleError(error));
        return response.data;
    }

    getTokenHeaders(): object {
        return {
            headers: {
                Authorization: `bearer ${this.token}`
            }
        };
    }

    handleError(error: any) {
        throw error;
    }

    saveToken(token: string) {
        this.token = token;
    }
}
