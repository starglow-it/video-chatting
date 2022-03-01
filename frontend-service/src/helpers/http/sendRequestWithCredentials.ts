import { parseCookies } from 'nookies';
import { NextPageContext } from 'next';
import { AxiosRequestConfig } from 'axios';
import setAuthCookies from './setAuthCookies';
import { sendRequest } from './sendRequest';
import { refreshUrl } from '../../utils/urls/resolveUrl';
import { TokenPair, ApiError, SuccessResult, FailedResult } from '../../store/types';

export interface IsomorphicRequestOptions extends AxiosRequestConfig {
    authRequest?: boolean;
    accessToken?: string;
    refreshToken?: string;
    ctx?: NextPageContext;
}

export default async function sendRequestWithCredentials<Result, Error>(
    path: string,
    options: IsomorphicRequestOptions = {},
): Promise<SuccessResult<Result> | FailedResult<Error>> {
    const { ctx, authRequest, ...requestOptions } = options;

    if (!authRequest) {
        return sendRequest<Result, Error>(path, requestOptions);
    }

    const cookies = parseCookies(ctx);

    const { accessToken = options.accessToken } = cookies;
    const { refreshToken = options.refreshToken } = cookies;

    if (!accessToken && !refreshToken) {
        return {
            success: false,
            result: undefined,
        };
    }
    if (accessToken) {
        return sendRequest<Result, Error>(path, {
            ...requestOptions,
            token: accessToken,
        });
    }

    const { result } = await sendRequest<TokenPair, ApiError>(refreshUrl, {
        method: 'PUT',
        data: {
            token: refreshToken,
        },
    });

    if (result?.accessToken && result?.refreshToken) {
        setAuthCookies(ctx, result?.accessToken, result?.refreshToken);
    }

    return sendRequest(path, {
        ...requestOptions,
        token: result?.accessToken?.token!,
    });
}
