import { NextPageContext } from 'next';
import { authDomain } from '../domains';

import { AuthAdminState, LoginAdminPayload } from '../types';

export const initialAuthState = {
    state: { isAuthenticated: false, admin: null },
    error: null,
} as AuthAdminState;

export const $authStore = authDomain.createStore<AuthAdminState>(initialAuthState);

export const loginAdminFx = authDomain.createEffect<LoginAdminPayload, AuthAdminState>(
    'loginAdminFx',
);
export const checkAdminAuthFx = authDomain.createEffect<NextPageContext, AuthAdminState>(
    'checkAdminAuthFx',
);
export const logoutAdminFx = authDomain.createEffect<void, AuthAdminState>('logoutAdminFx');

export const resetAuthErrorEvent = authDomain.createEvent<void>('resetAuthErrorEvent');
export const resetAuthStateEvent = authDomain.createEvent<void>('resetAuthStateEvent');
