import axios, { AxiosRequestConfig } from 'axios';
import {
    StorageKeysEnum,
    WebStorage,
} from '../../controllers/WebStorageController';
import { ApiParams, FailedResult, SuccessResult } from '../../store/types';

export async function sendRequest<Result, Error>(
    options: Partial<ApiParams> & AxiosRequestConfig = {},
): Promise<SuccessResult<Result> | FailedResult<Error>> {
    const { url } = options;
    const userWithoutLoginId = WebStorage.get<string>({
        key: StorageKeysEnum.userWithoutLoginId,
    });

    const { token, ...restOptions } = options;
    const headers = { ...restOptions.headers };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (userWithoutLoginId) {
        headers.userWithoutLoginId = userWithoutLoginId;
    }

    try {
        const response = await axios.request<{
            result: Result;
            success: boolean;
            statusCode: number;
        }>({ url, headers, ...restOptions });

        return {
            result: response?.data?.result ?? response.data,
            success: true,
        };
    } catch (err) {
        const typedError = err as any;

        return {
            success: false,
            error: typedError?.response?.data?.error,
            result: undefined,
            statusCode: typedError?.response?.data?.statusCode,
        };
    }
}
