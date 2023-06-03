import { Canceler, AxiosRequestConfig } from '@/plugins/axios';
import { NetworksType } from '@/types/networks';
import { AxiosError } from 'axios';

// returns data or error
type FetchResult<T> = Promise<[T | null, AxiosError|null, Canceler]>;

type SendResult<T> = Promise<[T|null, AxiosError|null, Canceler?]>;

type Config = AxiosRequestConfig;

type ConctactNames = 'daoFactory';

interface IPaginationParams {
    offset: number
}

interface IResponsePagination<T> {
    result: T[]
}

interface IResponsePaginationNormalized<T> {
    items: T[]
    offset: number
    total: number
}


interface sendDataChainProps {
    network?: NetworksType
    contractAddress?: string
    contractABI?: any
    contractName?: ConctactNames
    methodName: string
    params: any[]
    needReceipt?: boolean
    needWait?: boolean
}

export {
    FetchResult,
    SendResult,
    IResponsePagination,
    IResponsePaginationNormalized,
    IPaginationParams,
    sendDataChainProps,
    Config
}
