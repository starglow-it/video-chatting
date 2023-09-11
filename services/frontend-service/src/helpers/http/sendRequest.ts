import axios, { AxiosRequestConfig } from 'axios';
import { parseCookies } from 'nookies';
import { ApiParams, FailedResult, SuccessResult } from '../../store/types';

export async function sendRequest<Result, Error>(
    options: ApiParams & AxiosRequestConfig = {},
): Promise<SuccessResult<Result> | FailedResult<Error>> {
    const { token, url, headers, ctx, ...restOptions } = options;
    const newHeaders = { ...headers };
    if (token) {
        newHeaders.Authorization = `Bearer ${token}`;
    }
    const { userWithoutLoginId } = parseCookies(ctx);
    if (userWithoutLoginId) {
        newHeaders.userWithoutLoginId = userWithoutLoginId;
    }

    try {
        const response = await axios.request<{
            result: Result;
            success: boolean;
            statusCode: number;
        }>({ url, headers: newHeaders, ...restOptions });
        console.log('#Duy Phan console request', response);

        return {
            result: response?.data?.result ?? response.data,
            success: true,
        };
    } catch (err) {
        const typedError = err as any;
        console.log('catch error', err);
        return {
            success: false,
            error: typedError?.response?.data?.error,
            result: undefined,
            statusCode: typedError?.response?.data?.statusCode,
        };
    }
}
