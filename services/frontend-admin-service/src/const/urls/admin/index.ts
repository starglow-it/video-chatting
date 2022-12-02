import {
	HttpMethods 
} from 'shared-types';
import {
	authScope 
} from 'shared-const';
import {
	serverUrl 
} from '../common';

export const loginAdminUrl = {
	url: `${serverUrl}/${authScope}/admin`,
	method: HttpMethods.Post,
};

export const adminUrl = {
	url: `${serverUrl}/${authScope}/admin`,
	method: HttpMethods.Get,
};

export const logoutAdminUrl = {
	url: `${serverUrl}/${authScope}/admin`,
	method: HttpMethods.Delete,
};

export const refreshUrl = {
	url: `${serverUrl}/${authScope}/admin`,
	method: HttpMethods.Put,
};
