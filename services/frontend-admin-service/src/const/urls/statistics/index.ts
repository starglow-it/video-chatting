import {statisticsScope} from "shared-const";
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
