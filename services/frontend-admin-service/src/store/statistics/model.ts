import { statisticsDomain } from '../domains';
import {
	UsersStatisticsState,
	SubscriptionsStatisticsState,
	RoomsStatisticsState,
	RoomsRatingStatisticState,
	GetRoomRatingStatisticParams,
	GetMonetizationStatisticParams,
	MonetizationStatisticState,
} from '../types';

export const $usersStatisticsStore =
    statisticsDomain.createStore<UsersStatisticsState>({
    	state: {
    		data: [],
    		totalNumber: 0,
    	},
    	error: null,
    });

export const $subscriptionsStatistics =
    statisticsDomain.createStore<SubscriptionsStatisticsState>({
    	state: {
    		data: [],
    		totalNumber: 0,
    	},
    	error: null,
    });

export const $roomsStatistics =
    statisticsDomain.createStore<RoomsStatisticsState>({
    	state: {
    		data: [],
    		totalNumber: 0,
    	},
    	error: null,
    });

export const $roomsRatingStatistics =
    statisticsDomain.createStore<RoomsRatingStatisticState>({
    	state: {
    		data: [],
    		totalNumber: 0,
    	},
    	error: null,
    });

export const $usersMonetizationStatistics =
    statisticsDomain.createStore<MonetizationStatisticState>({
    	state: {
    		totalNumber: 0,
    		data: [],
    	},
    	error: null,
    });

export const $platformMonetizationStatistics =
    statisticsDomain.createStore<MonetizationStatisticState>({
    	state: {
    		totalNumber: 0,
    		data: [],
    	},
    	error: null,
    });

export const getUsersStatisticsFx = statisticsDomain.createEffect<
    void,
    UsersStatisticsState
>('getUsersStatisticsFx');

export const getSubscriptionsStatisticsFx = statisticsDomain.createEffect<
    void,
    SubscriptionsStatisticsState
>('getSubscriptionsStatisticsFx');

export const getRoomsStatisticsFx = statisticsDomain.createEffect<
    void,
    RoomsStatisticsState
>('getRoomsStatisticsFx');

export const getRoomRatingStatisticsFx = statisticsDomain.createEffect<
    GetRoomRatingStatisticParams,
    RoomsRatingStatisticState
>('getRoomsStatisticsFx');

export const getUsersMonetizationStatisticsFx = statisticsDomain.createEffect<
    GetMonetizationStatisticParams,
    MonetizationStatisticState
>('getUsersMonetizationStatisticsFx');

export const getPlatformMonetizationStatisticsFx =
    statisticsDomain.createEffect<
        GetMonetizationStatisticParams,
        MonetizationStatisticState
    >('getPlatformMonetizationStatisticsFx');

export const resetUsersMonetization = statisticsDomain.createEvent(
	'resetUsersMonetization',
);
export const resetPlatformMonetization = statisticsDomain.createEvent(
	'resetPlatformMonetization',
);
