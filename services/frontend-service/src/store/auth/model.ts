import { NextPageContext } from 'next';
import { authDomain } from '../domains';

import { AuthUserState, GoogleVerfifyParams, LoginUserParams } from '../types';

export const initialAuthState: AuthUserState = {
    isAuthenticated: false,
    error: null,
};

export const $authStore = authDomain.createStore<AuthUserState>(initialAuthState);

export const loginUserFx = authDomain.createEffect<LoginUserParams, AuthUserState>('loginUserFx');
export const setUserCountryFx = authDomain.createEffect<void, void>('setUserCountryFx');
export const checkAuthFx = authDomain.createEffect<NextPageContext | undefined, AuthUserState>('checkAuthFx');
export const refreshAuthFx = authDomain.createEffect<void, AuthUserState>('refreshAuthFx');
export const logoutUserFx = authDomain.createEffect<void, AuthUserState>('logoutUserFx');
export const googleVeirfyFx = authDomain.createEffect<GoogleVerfifyParams, AuthUserState>('googleVerifyFx');


export const resetAuthErrorEvent = authDomain.createEvent<void>('resetAuthErrorEvent');
export const resetAuthStateEvent = authDomain.createEvent<void>('resetAuthStateEvent');
