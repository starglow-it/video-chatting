import {
    TokenPair,
    StateWithError,
    UserStatistics,
    SubscriptionsStatisticsType,
    RoomsStatistics,
    RoomRatingStatistics,
    MonetizationStatistics,
    UsersList,
    ICommonUser,
    MonetizationStatisticPeriods,
    UserProfileId,
    UserProfile,
    UserProfileStatistic,
    UserProfileTemplate, QueryParams,
} from 'shared-types';

/**
 * Effector state types
 */
export type AuthAdminState = StateWithError<{
    isAuthenticated: boolean;
    admin: ICommonUser | null;
}>;
export type UsersStatisticsState = StateWithError<UserStatistics>;
export type RoomsRatingStatisticState = StateWithError<RoomRatingStatistics>;
export type SubscriptionsStatisticsState = StateWithError<SubscriptionsStatisticsType>;
export type RoomsStatisticsState = StateWithError<RoomsStatistics>;
export type MonetizationStatisticState = StateWithError<MonetizationStatistics>;
export type UsersListState = StateWithError<UsersList>;
export type UserProfileState = StateWithError<UserProfile>;
export type UserProfileStatisticState = StateWithError<UserProfileStatistic>;
export type UserProfileTemplateState = StateWithError<UserProfileTemplate>;
export type UserProfileIdState = StateWithError<UserProfileId>;

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

export type GetUserProfileParams = { userId: UserProfileId };
export type GetUserProfileStatisticsParams = { userId: UserProfileId };
export type GetUserProfileTemplateParams = { userId: UserProfileId } & QueryParams;
export type BlockUserParams = { userId: UserProfileId; isBlocked: ICommonUser["isBlocked"] };
export type DeleteUserParams = { userId: UserProfileId };

export type GetMonetizationStatisticParams = {
    period: MonetizationStatisticPeriods;
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
export type MonetizationStatisticResponse = MonetizationStatisticState['state'];

export type AdminDialogsState = {
    blockUserDialog: boolean;
    deleteUserDialog: boolean;
}

export enum AdminDialogsEnum {
    blockUserDialog = 'blockUserDialog',
    deleteUserDialog = 'deleteUserDialog',
}

export type DialogActionPayload = {
    dialogKey: AdminDialogsEnum;
};

export enum NotificationType {
    userBlocked = 'userBlocked',
    userUnBlocked = 'userUnBlocked',
    userDeleted = 'userDeleted',
}

export type Notification = {
    type: NotificationType;
    message: string;
    messageOptions?: { [key: string]: any };
    withSuccessIcon?: boolean;
    withErrorIcon?: boolean;
    withManualClose?: boolean;
    iconType?: string;
};
