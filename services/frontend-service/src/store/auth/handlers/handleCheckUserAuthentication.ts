import { NextPageContext } from 'next';
import { ErrorState, UserRoles } from 'shared-types';
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
        const isWithoutAuthen = response?.result?.role === UserRoles.Anonymous;
        return {
            isAuthenticated: !isWithoutAuthen,
            user: response?.result,
            isWithoutAuthen,
        };
    }
    if (!response.success) {
        return {
            isAuthenticated: response.success,
            error: response?.error,
            isWithoutAuthen: false,
        };
    }

    return {
        isAuthenticated: false,
        isWithoutAuthen: false,
    };
};
