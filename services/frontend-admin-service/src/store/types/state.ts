import {
    BusinessCategoryList,
    CommonTemplatesList,
    ICommonTemplate,
    ICommonUser,
    MonetizationStatistics,
    RoomRatingStatistics,
    RoomsStatistics,
    StateWithError,
    SubscriptionsStatisticsType,
    UserProfile,
    UserProfileId,
    UserProfileStatistic,
    UserProfileTemplate,
    UsersList,
    UserStatistics,
} from 'shared-types';

export type AuthAdminState = StateWithError<{
    isAuthenticated: boolean;
    admin: ICommonUser | null;
}>;
export type UsersStatisticsState = StateWithError<UserStatistics>;
export type RoomsRatingStatisticState = StateWithError<RoomRatingStatistics>;
export type SubscriptionsStatisticsState =
    StateWithError<SubscriptionsStatisticsType>;
export type RoomsStatisticsState = StateWithError<RoomsStatistics>;
export type MonetizationStatisticState = StateWithError<MonetizationStatistics>;
export type UsersListState = StateWithError<UsersList>;
export type UserProfileState = StateWithError<UserProfile>;
export type UserProfileStatisticState = StateWithError<UserProfileStatistic>;
export type UserProfileTemplateState = StateWithError<UserProfileTemplate>;
export type UserProfileIdState = StateWithError<UserProfileId>;
export type CommonTemplatesListState = StateWithError<CommonTemplatesList>;
export type CommonTemplateState = StateWithError<ICommonTemplate | undefined>;
export type BusinessCategoriesState = StateWithError<BusinessCategoryList>;
