import {
    TokenPair,
    StateWithError,
    UserStatistics,
    SubscriptionsStatisticsType,
    RoomsStatistics,
    RoomRatingStatistics,
    MonetizationStatistics,
} from 'shared-types';

/**
 * Effector state types
 */
export type AuthAdminState = StateWithError<{
    isAuthenticated: boolean;
    admin: unknown;
}>;
export type UsersStatisticsState = StateWithError<UserStatistics>;
export type RoomsRatingStatisticState = StateWithError<RoomRatingStatistics>;
export type SubscriptionsStatisticsState = StateWithError<SubscriptionsStatisticsType>;
export type RoomsStatisticsState = StateWithError<RoomsStatistics>;
export type MonetizationStatisticState = StateWithError<MonetizationStatistics>;

/**
 * Http requests payload types
 */
export type LoginAdminPayload = {
    email: string;
    password: string;
};

export type GetRoomRatingStatisticParams = {
    basedOn: string;
    roomType: string;
};

export type GetMonetizationStatisticParams = {
    period: 'month' | 'allTime';
    type: 'users' | 'platform';
};

/**
 * Responses types
 */
export type LoginAdminResponse = { admin: AuthAdminState['state']['admin'] } & TokenPair;
export type SubscriptionsStatisticsResponse = SubscriptionsStatisticsState['state'];
export type RoomsStatisticsResponse = RoomsStatisticsState['state'];
export type UsersStatisticsResponse = UsersStatisticsState['state'];
export type CheckAdminResponse = AuthAdminState['state']['admin'];
export type RoomsRatingStatisticResponse = RoomsRatingStatisticState['state'];
