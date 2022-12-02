import {
	ErrorState, UserProfileStatistic 
} from 'shared-types';
import {
	sendRequest 
} from '../../../helpers/http/sendRequest';
import {
	userProfileStatisticUrl 
} from '../../../const/urls/users';
import {
	GetUserProfileStatisticsParams,
	UserProfileStatisticState,
} from '../../types';

export const handleGetUserProfileStatistic = async (
	payload: GetUserProfileStatisticsParams,
): Promise<UserProfileStatisticState> => {
	const response = await sendRequest<UserProfileStatistic, ErrorState>(
		userProfileStatisticUrl(payload),
	);

	if (response.success) {
		return {
			state: response.result ?? null,
			error: null,
		};
	}

	if (!response.success) {
		return {
			state: null,
			error: response.error,
		};
	}

	return {
		state: null,
		error: null,
	};
};
