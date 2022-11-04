import { statisticsScope } from 'shared-const';
import { HttpMethods } from 'shared-types';

import { serverUrl } from '../common';

export const usersStatisticsUrl = {
    url: `${serverUrl}/${statisticsScope}/users`,
    method: HttpMethods.Get,
};

export const subscriptionsStatisticsUrl = {
    url: `${serverUrl}/${statisticsScope}/subscriptions`,
    method: HttpMethods.Get,
};

export const roomsStatisticsUrl = {
    url: `${serverUrl}/${statisticsScope}/rooms`,
    method: HttpMethods.Get,
};

export const roomsRatingStatisticUrl = ({ basedOn, roomType }) => ({
    url: `${serverUrl}/${statisticsScope}/rating?basedOn=${basedOn}&roomType=${roomType}`,
    method: HttpMethods.Get,
});

export const monetizationStatisticUrl = ({ period = 'month', type = 'users' }) => ({
    url: `${serverUrl}/${statisticsScope}/monetization?period=${period}&type=${type}`,
    method: HttpMethods.Get,
});
