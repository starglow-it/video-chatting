import { NextPageContext } from 'next';
import { authDomain } from '../domains';
import {
    AuthUserState,
    GoogleVerfifyParams,
    LoginUserParams,
    Profile,
} from '../types';
import { InitUserPayload } from './type';

export const initialAuthState: AuthUserState = {
    isAuthenticated: false,
    error: null,
};

export const $authStore =
    authDomain.createStore<AuthUserState>(initialAuthState);

export const loginUserFx = authDomain.createEffect<
    LoginUserParams,
    AuthUserState
>('loginUserFx');
export const setUserCountryFx = authDomain.createEffect<void, void>(
    'setUserCountryFx',
);
export const checkAuthFx = authDomain.createEffect<
    NextPageContext | undefined,
    AuthUserState
>('checkAuthFx');
export const refreshAuthFx = authDomain.createEffect<void, AuthUserState>(
    'refreshAuthFx',
);
export const logoutUserFx = authDomain.createEffect<void, AuthUserState>(
    'logoutUserFx',
);
export const googleVerifyFx = authDomain.createEffect<
    GoogleVerfifyParams,
    AuthUserState
>('googleVerifyFx');

export const resetAuthErrorEvent = authDomain.createEvent<void>(
    'resetAuthErrorEvent',
);
export const resetAuthStateEvent = authDomain.createEvent<void>(
    'resetAuthStateEvent',
);

export const initUserWithoutTokenFx = authDomain.createEffect<
    InitUserPayload,
    { user: Profile | null; userTemplateId: string; subdomain?: string }
>('initUserWithoutToken');

export const deleteDraftUsers = authDomain.createEffect<void, void>(
    'deleteDraftUsers',
);
