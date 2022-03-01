import { forward } from 'effector-next';
import { parseCookies } from 'nookies';

import { $authStore, checkAuthFx, loginUserFx, logoutUserFx, resetAuthErrorEvent } from './model';
import { clearProfileEvent, setProfileEvent } from '../profile';

import { loginUserUrl, logoutProfileUrl, meUrl } from '../../utils/urls/resolveUrl';

import setAuthCookies from '../../helpers/http/setAuthCookies';
import sendRequestWithCredentials from '../../helpers/http/sendRequestWithCredentials';
import { deleteAuthCookies } from '../../helpers/http/destroyCookies';
import { sendRequest } from '../../helpers/http/sendRequest';

import { ErrorState, HttpMethods, Profile, TokenPair } from '../types';

loginUserFx.use(async params => {
    const response = await sendRequest<{ user: Profile } & TokenPair, ErrorState>(loginUserUrl, {
        method: HttpMethods.Post,
        data: params,
    });

    if (response.success) {
        setAuthCookies(undefined, response?.result?.accessToken, response?.result?.refreshToken);
        return {
            isAuthenticated: response.success,
            user: response?.result?.user,
        };
    } else if (!response.success) {
        return {
            isAuthenticated: false,
            error: response?.error,
        };
    }
    return {
        isAuthenticated: false,
    };
});

checkAuthFx.use(async ctx => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>(meUrl, {
        ctx,
        authRequest: true,
    });

    if (response.success) {
        return {
            isAuthenticated: response.success,
            user: response?.result,
        };
    } else if (!response.success) {
        return {
            isAuthenticated: response.success,
            error: response?.error,
        };
    }

    return {
        isAuthenticated: false,
    };
});

logoutUserFx.use(async () => {
    const { refreshToken } = parseCookies();

    await sendRequestWithCredentials<any, ErrorState>(logoutProfileUrl, {
        method: HttpMethods.Delete,
        data: { token: refreshToken },
    });

    deleteAuthCookies(undefined);

    return {
        isAuthenticated: false,
    };
});

forward({
    from: loginUserFx.doneData,
    to: setProfileEvent,
});

forward({
    from: checkAuthFx.doneData,
    to: setProfileEvent,
});

forward({
    from: logoutUserFx.doneData,
    to: clearProfileEvent,
});

$authStore
    .on(loginUserFx.doneData, (state, data) => ({ ...state, ...data }))
    .on(checkAuthFx.doneData, (state, data) => ({ ...state, ...data }))
    .on(logoutUserFx.doneData, (state, data) => ({ ...state, ...data }))
    .on(resetAuthErrorEvent, ({ error, ...rest }) => ({ ...rest }));
