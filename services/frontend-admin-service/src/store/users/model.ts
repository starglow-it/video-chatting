import { QueryParams } from 'shared-types';
import { usersDomain } from '../domains';
import { UsersListState } from '../types';

export const $usersStore = usersDomain.createStore<UsersListState>({
    state: {
        count: 0,
        list: [],
    },
    error: null,
});

export const getUsersListFx = usersDomain.createEffect<QueryParams, UsersListState>(
    'getUsersListFx',
);
