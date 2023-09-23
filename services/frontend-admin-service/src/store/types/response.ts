import { TokenPair } from 'shared-types';
import {
    AuthAdminState,
    MonetizationStatisticState,
    RoomsRatingStatisticState,
    RoomsStatisticsState,
    SubscriptionsStatisticsState,
    UsersStatisticsState,
} from './state';

export type LoginAdminResponse = {
    admin: AuthAdminState['state']['admin'];
} & TokenPair;
export type SubscriptionsStatisticsResponse =
    SubscriptionsStatisticsState['state'];
export type RoomsStatisticsResponse = RoomsStatisticsState['state'];
export type UsersStatisticsResponse = UsersStatisticsState['state'];
export type CheckAdminResponse = AuthAdminState['state']['admin'];
export type RoomsRatingStatisticResponse = RoomsRatingStatisticState['state'];
export type MonetizationStatisticResponse = MonetizationStatisticState['state'];
