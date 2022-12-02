import {
	statisticsScope, usersScope 
} from 'shared-const';
import {
	HttpMethods, QueryParams 
} from 'shared-types';

import {
	serverUrl 
} from '../common';
import {
	GetUserProfileParams,
	GetUserProfileStatisticsParams,
	GetUserProfileTemplateParams,
} from '../../../store/types';

export const usersListUrl = ({
	skip = 0, 
	limit = 0, 
	search 
}: QueryParams) => ({
	url: `${serverUrl}/${usersScope}?skip=${skip}&limit=${limit}&search=${search}`,
	method: HttpMethods.Get,
});

export const userProfileUrl = ({
	userId 
}: GetUserProfileParams) => ({
	url: `${serverUrl}/${usersScope}/${userId}`,
	method: HttpMethods.Get,
});

export const userProfileStatisticUrl = ({
	userId,
}: GetUserProfileStatisticsParams) => ({
	url: `${serverUrl}/${statisticsScope}/user/${userId}`,
	method: HttpMethods.Get,
});

export const userProfileTemplateUrl = ({
	userId,
	limit = 0,
	sort,
	skip = 0,
	direction = 1,
}: GetUserProfileTemplateParams) => ({
	url: `${serverUrl}/${usersScope}/${userId}/templates?skip=${skip}&limit=${limit}&sort=${sort}&dir=${direction}`,
	method: HttpMethods.Get,
});

export const searchUsersUrl = ({
	skip = 0,
	limit = 0,
	search,
}: QueryParams) => ({
	url: `${serverUrl}/${usersScope}/search?skip=${skip}&limit=${limit}&search=${search}`,
	method: HttpMethods.Get,
});

export const blockUserUrl = ({
	userId,
	key,
	value,
}: {
    userId: string;
    key: string;
    value: boolean;
}) => ({
	url: `${serverUrl}/${usersScope}/rights/${userId}?key=${key}&value=${value}`,
	method: HttpMethods.Post,
});

export const deleteUserUrl = ({
	userId 
}: { userId: string }) => ({
	url: `${serverUrl}/${usersScope}/${userId}`,
	method: HttpMethods.Delete,
});
