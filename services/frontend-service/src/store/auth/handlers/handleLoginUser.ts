import { ErrorState } from 'shared-types';

import { sendRequest } from '../../../helpers/http/sendRequest';
import { LoginUserPayload, LoginUserResponse } from '../../types';
import setAuthCookies from '../../../helpers/http/setAuthCookies';
import {authApiMethods} from "../../../utils/urls";

export const handleLoginUser = async (params: LoginUserPayload) => {
    const loginUserUrl = authApiMethods.loginUserUrl();

    const response = await sendRequest<LoginUserResponse, ErrorState>({
        ...loginUserUrl,
        data: params,
    });

    if (response.success) {
        setAuthCookies(undefined, response?.result?.accessToken, response?.result?.refreshToken);
        return {
            isAuthenticated: response.success,
            user: response?.result?.user,
        };
    }

    if (!response.success) {
        return {
            isAuthenticated: false,
            error: response?.error,
        };
    }

    return {
        isAuthenticated: false,
    };
};
