import { NextPageContext } from 'next';
import { ErrorState } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { Profile } from '../../types';
import { meUrl } from '../../../utils/urls';

export const handleCheckUserAuthentication = async (ctx?: NextPageContext) => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>({
        ...meUrl,
        ctx,
        authRequest: true,
    });

    if (response.success) {
        return {
            isAuthenticated: response.success,
            user: response?.result,
        };
    }
    if (!response.success) {
        return {
            isAuthenticated: response.success,
            error: response?.error,
        };
    }

    return {
        isAuthenticated: false,
    };
};
