import { HttpMethods } from '../../store/types';
import { authScope, serverUrl } from './baseData';

export const REFRESH_URL = `${authScope}/refresh`;
export const LOGIN_USER_URL = `${authScope}/login`;
export const ME_URL = `${authScope}/me`;
export const LOGOUT_URL = `${authScope}/logout`;

export const loginUserUrl = {
    url: `${serverUrl}/${LOGIN_USER_URL}`,
    method: HttpMethods.Post,
};

export const meUrl = {
    url: `${serverUrl}/${ME_URL}`,
    method: HttpMethods.Get,
};

export const refreshUrl = {
    url: `${serverUrl}/${REFRESH_URL}`,
    method: HttpMethods.Put,
};

export const logoutProfileUrl = {
    url: `${serverUrl}/${LOGOUT_URL}`,
    method: HttpMethods.Delete,
};
