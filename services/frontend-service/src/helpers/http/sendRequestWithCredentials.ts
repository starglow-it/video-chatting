import { parseCookies } from 'nookies';
import { NextPageContext } from 'next';
import { AxiosRequestConfig } from 'axios';
import { TokenPair, ApiError, SuccessResult, FailedResult } from 'shared-types';
import setAuthCookies from './setAuthCookies';
import { sendRequest } from './sendRequest';
import { refreshUrl } from '../../utils/urls';

export interface IsomorphicRequestOptions extends AxiosRequestConfig {
    authRequest?: boolean;
    accessToken?: string;
    refreshToken?: string;
    ctx?: NextPageContext;
}

export default async function sendRequestWithCredentials<Result, Error>(
    options: IsomorphicRequestOptions = {},
): Promise<SuccessResult<Result> | FailedResult<Error>> {
    const { ctx, authRequest, ...requestOptions } = options;

    const path = options.url;

    if (!authRequest) {
        return sendRequest<Result, Error>(requestOptions);
    }

    const cookies = parseCookies(ctx);

    const {
        accessToken = options.accessToken,
        refreshToken = options.refreshToken,
        userWithoutLoginId,
    } = cookies;
    console.log('#Duy Phan console cookie', userWithoutLoginId)

    if(userWithoutLoginId) {
        return sendRequest<Result, Error>({
            url: path,
            ctx,
            ...requestOptions,
        });
    }

    if (!accessToken && !refreshToken) {
        return {
            success: false,
            result: undefined,
        };
    }

    if (accessToken) {
        return sendRequest<Result, Error>({
            url: path,
            ...requestOptions,
            token: accessToken,
        });
    }

    const { result } = await sendRequest<TokenPair, ApiError>({
        ...refreshUrl,
        data: {
            token: refreshToken,
        },
    });

    if (result?.accessToken && result?.refreshToken) {
        setAuthCookies(ctx, result?.accessToken, result?.refreshToken);
    }

    return sendRequest({
        url: path,
        ...requestOptions,
        token: result?.accessToken?.token,
    });
}
