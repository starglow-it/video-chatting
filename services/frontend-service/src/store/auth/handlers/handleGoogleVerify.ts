import { ErrorState } from 'shared-types';

import { sendRequest } from '../../../helpers/http/sendRequest';
import { GoogleVerfifyParams, LoginUserResponse } from '../../types';
import { googleVerifyUrl } from '../../../utils/urls';
import setAuthCookies from '../../../helpers/http/setAuthCookies';

export const handleGoogleVerify = async (params: GoogleVerfifyParams) => {
    const response = await sendRequest<LoginUserResponse, ErrorState>({
        ...googleVerifyUrl,
        data: params,
    });

    if (response.success) {
        setAuthCookies(
            undefined,
            response?.result?.accessToken,
            response?.result?.refreshToken,
        );
        return {
            isAuthenticated: response.success,
            user: response?.result?.user,
            isFirstLogin: response?.result.isFirstLogin,
        };
    }

    if (!response.success) {
        return {
            isAuthenticated: false,
            error: response?.error,
            isFirstLogin: false,
        };
    }

    return {
        isAuthenticated: false,
        isFirstLogin: false,
    };
};
