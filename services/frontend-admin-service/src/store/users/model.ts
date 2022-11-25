import {ErrorState, ICommonUser, QueryParams, UserProfileId} from 'shared-types';
import { usersDomain } from '../domains';
import {
    BlockUserParams, DeleteUserParams,
    GetUserProfileParams,
    GetUserProfileStatisticsParams,
    GetUserProfileTemplateParams,
    UserProfileIdState,
    UserProfileState,
    UserProfileStatisticState,
    UserProfileTemplateState,
    UsersListState,
} from '../types';

export const $usersStore = usersDomain.createStore<UsersListState>({
    state: {
        count: 0,
        list: [],
    },
    error: null,
});

export const $userProfileIdStore = usersDomain.createStore<UserProfileIdState>({
    state: null,
    error: null,
});

export const $userProfileStore = usersDomain.createStore<UserProfileState>({
    state: null,
    error: null,
});

export const $userProfileStatisticStore = usersDomain.createStore<UserProfileStatisticState>({
    state: null,
    error: null,
});

export const $userProfileTemplateStore = usersDomain.createStore<UserProfileTemplateState>({
    state: null,
    error: null,
});

export const $blockUserIdStore = usersDomain.createStore<UserProfileIdState>({
    state: null,
    error: null,
});

export const $deleteUserIdStore = usersDomain.createStore<UserProfileIdState>({
    state: null,
    error: null,
});

export const setBlockUserId = usersDomain.createEvent<UserProfileId>('setBlockUserId');
export const setDeleteUserId = usersDomain.createEvent<UserProfileId>('setDeleteUserId');
export const setUserProfileIdEvent =
    usersDomain.createEvent<UserProfileId>('setUserProfileIdEvent');

export const getUsersListFx = usersDomain.createEffect<QueryParams, UsersListState>(
    'getUsersListFx',
);

export const searchUsersFx = usersDomain.createEffect<QueryParams, UsersListState>('searchUsersFx');

export const getUserProfileFx = usersDomain.createEffect<GetUserProfileParams, UserProfileState>(
    'getUserProfileFx',
);

export const getUserProfileStatisticFx = usersDomain.createEffect<
    GetUserProfileStatisticsParams,
    UserProfileStatisticState
>('getUserProfileStatisticFx');

export const getUserProfileTemplateFx = usersDomain.createEffect<
    GetUserProfileTemplateParams,
    UserProfileTemplateState
>('getUserProfileTemplateFx');

export const blockUserFx = usersDomain.createEffect<
    BlockUserParams,
    ICommonUser | undefined,
    ErrorState
>('blockUserFx');

export const deleteUserFx = usersDomain.createEffect<
    DeleteUserParams,
    void
>('deleteUserFx');
