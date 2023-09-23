import axios, { AxiosRequestConfig } from 'axios';
import { ApiParams, FailedResult, SuccessResult } from 'shared-types';

export async function sendRequest<Result, Error>(
    options: ApiParams & AxiosRequestConfig = {},
): Promise<SuccessResult<Result> | FailedResult<Error>> {
    const { url } = options;

    const { token, ...restOptions } = options;

    if (token) {
        restOptions.headers = {
            ...restOptions.headers,
            Authorization: `Bearer ${token}`,
        };
    }

    try {
        const response = await axios.request<{
            result: Result;
            success: boolean;
            statusCode: number;
        }>({
            url,
            ...restOptions,
        });

        return {
            result: response?.data?.result,
            success: true,
        };
    } catch (err) {
        const typedError = err as unknown;

        return {
            success: false,
            error: typedError?.response?.data?.error,
            result: undefined,
            statusCode: typedError?.response?.data?.statusCode,
        };
    }
}
