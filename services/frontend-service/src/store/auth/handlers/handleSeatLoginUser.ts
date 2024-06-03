import { ErrorState } from 'shared-types';

import { sendRequest } from '../../../helpers/http/sendRequest';
import { SeatLoginUserPayload, LoginUserResponse } from '../../types';
import { seatLoginUserUrl } from '../../../utils/urls';
import setAuthCookies from '../../../helpers/http/setAuthCookies';

export const handleSeatLoginUser = async (params: SeatLoginUserPayload) => {
    const response = await sendRequest<LoginUserResponse, ErrorState>({
        ...seatLoginUserUrl,
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
