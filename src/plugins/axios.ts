import axios, { Canceler, AxiosRequestConfig, AxiosError } from 'axios';

axios.defaults.baseURL = process.env.VUE_APP_API_ADDRESS;

export default axios;

export {
    Canceler,
    AxiosRequestConfig,
    AxiosError
}
