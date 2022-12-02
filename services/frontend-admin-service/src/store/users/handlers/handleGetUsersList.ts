import {
	ErrorState, QueryParams, UsersList 
} from 'shared-types';
import {
	UsersListState 
} from '../../types';
import {
	sendRequest 
} from '../../../helpers/http/sendRequest';
import {
	usersListUrl 
} from '../../../const/urls/users';

export const handleGetUsersList = async (
	payload: QueryParams,
): Promise<UsersListState> => {
	const response = await sendRequest<UsersList, ErrorState>(
		usersListUrl(payload),
	);

	if (response.success) {
		return {
			state: response.result,
			error: null,
		};
	}

	if (!response.success) {
		return {
			state: {
				count: 0,
				list: [],
			},
			error: response.error,
		};
	}

	return {
		state: {
			count: 0,
			list: [],
		},
		error: null,
	};
};
