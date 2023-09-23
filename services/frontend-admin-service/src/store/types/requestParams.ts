import {
    ICommonUser,
    MonetizationStatisticPeriods,
    QueryParams,
    UserProfileId,
} from 'shared-types';

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
export type GetUserProfileTemplateParams = {
    userId: UserProfileId;
} & QueryParams;
export type BlockUserParams = {
    userId: UserProfileId;
    isBlocked: ICommonUser['isBlocked'];
};
export type DeleteUserParams = { userId: UserProfileId };

export type GetMonetizationStatisticParams = {
    period: MonetizationStatisticPeriods;
    type: 'users' | 'platform';
};
