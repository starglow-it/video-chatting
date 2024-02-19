import { statisticsDomain } from '../domains';
import {
    UsersStatisticsState,
    SubscriptionsStatisticsState,
    RoomsStatisticsState,
    RoomsRatingStatisticState,
    GetRoomRatingStatisticParams,
    GetMonetizationStatisticParams,
    MonetizationStatisticState,
    MeetingStatisticsState
} from '../types';

const initialMeetingStatisticsState:MeetingStatisticsState = {
    meetingNames: {
        id: '',
        name: '',
        startedAt: '',
    },
    attendeesData: {
        totalParticipants: 0,
        totalAudiences: 0,
        participantAverageMeetingTime: 0,
        audienceAverageMeetingTime: 0
    },
    countriesArray: [],
    reactions: {
        total: 0,
        participants: 0,
        audiences: 0,
        reactions: []
    },
    qaStatistics: [],
    meetingLinks: [],
    monetization: {
        entryFee: 0,
        totalFees: 0,
        donations: 0,
    }
}

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
    statisticsDomain.createStore<MeetingStatisticsState>(initialMeetingStatisticsState);

export const $roomsStatisticsLoading =
    statisticsDomain.createStore<boolean>(true);

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

export const setRoomsStatisticsEvent = statisticsDomain.createEvent(
    'setRoomsStatistics',
);

export const resetPlatformMonetization = statisticsDomain.createEvent(
    'resetPlatformMonetization',
);

export const setRoomStatisticsLoadingEvent = statisticsDomain.createEvent<boolean>(
    'setRoomStatisticsLoadingEvent',
);
