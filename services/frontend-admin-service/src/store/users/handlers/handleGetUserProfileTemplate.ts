import {
	EntityList, ErrorState, UserProfileTemplate 
} from 'shared-types';
import {
	sendRequest 
} from '../../../helpers/http/sendRequest';
import {
	userProfileTemplateUrl 
} from '../../../const/urls/users';
import {
	GetUserProfileTemplateParams,
	UserProfileTemplateState,
} from '../../types';

export const handleGetUserProfileTemplate = async (
	payload: GetUserProfileTemplateParams,
): Promise<UserProfileTemplateState> => {
	const response = await sendRequest<
        EntityList<UserProfileTemplate>,
        ErrorState
    >(userProfileTemplateUrl(payload));

	if (response.success) {
		return {
			state: response.result?.list?.[0] ?? null,
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
