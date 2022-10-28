import { statisticsDomain } from '../domains';
import { UsersStatisticsState, SubscriptionsStatisticsState } from '../types';

export const $usersStatisticsStore = statisticsDomain.createStore<UsersStatisticsState>({
    state: {
        users: [],
        totalNumber: 0,
    },
    error: null,
});

export const $subscriptionsStatistics = statisticsDomain.createStore<SubscriptionsStatisticsState>({
    state: {
        subscriptions: {
            house: 0,
            professional: 0,
            business: 0
        },
        totalNumber: 0,
    },
    error: null,
});

export const getUsersStatisticsFx = statisticsDomain.createEffect<void, UsersStatisticsState>(
    'getUsersStatisticsFx',
);

export const getSubscriptionsStatisticsFx = statisticsDomain.createEffect<void, SubscriptionsStatisticsState>(
    'getSubscriptionsStatisticsFx',
);
