import { sendRequest } from '../../../helpers/http/sendRequest';
import {ErrorState, LoginUserPayload, LoginUserResponse} from '../../types';
import { loginUserUrl } from '../../../utils/urls';
import setAuthCookies from '../../../helpers/http/setAuthCookies';

export const handleLoginUser = async (params: LoginUserPayload) => {
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
