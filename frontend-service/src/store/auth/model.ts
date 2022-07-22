import { NextPageContext } from 'next';

import { root } from '../root';

import { AuthUserState, LoginUserParams } from '../types';

export const authDomain = root.createDomain('authDomain');

export const initialAuthState: AuthUserState = {
    isAuthenticated: false,
};

export const $authStore = authDomain.createStore<AuthUserState>(initialAuthState);

export const loginUserFx = authDomain.effect<LoginUserParams, AuthUserState>('loginUserFx');
export const checkAuthFx = authDomain.effect<NextPageContext, AuthUserState>('checkAuthFx');
export const logoutUserFx = authDomain.effect<void, AuthUserState>('logoutUserFx');

export const resetAuthErrorEvent = authDomain.event('resetAuthErrorEvent');
export const resetAuthStateEvent = authDomain.event('resetAuthStateEvent');
