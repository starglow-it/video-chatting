import { parseCookies } from 'nookies';
import { ErrorState } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { logoutProfileUrl } from '../../../utils/urls';
import { deleteAuthCookies } from '../../../helpers/http/destroyCookies';

export const handleLogoutUser = async () => {
    const { refreshToken } = parseCookies();

    await sendRequestWithCredentials<void, ErrorState>({
        ...logoutProfileUrl,
        data: { token: refreshToken },
    });

    deleteAuthCookies(undefined);

    return {
        isAuthenticated: false,
    };
};
