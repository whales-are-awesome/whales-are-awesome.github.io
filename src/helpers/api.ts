import axios, { Canceler, AxiosError } from '@/plugins/axios';
import camelize from '@/helpers/camelize';
import { FetchResult } from '@/types/api'

class API {
    static async get<T>(path: string, params?: {[key: string]: any}): FetchResult<T> {
        try {
            let cancel: Canceler | (() => void) = () => {};

            const data: { data: T } = await axios.get<T>(path, {
                params,
                cancelToken: new axios.CancelToken((_cancel) => cancel = _cancel),
            });

            return [camelize(data.data), null, cancel];
        } catch (e) {
            return [null, e as AxiosError, () => {}];
        }
    }
}
export default API;
