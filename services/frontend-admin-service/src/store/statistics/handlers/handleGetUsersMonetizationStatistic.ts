import {
	ErrorState 
} from 'shared-types';
import {
	sendRequest 
} from '../../../helpers/http/sendRequest';
import {
	monetizationStatisticUrl 
} from '../../../const/urls/statistics';
import {
	MonetizationStatisticResponse 
} from '../../types';

export const handleGetUsersMonetizationStatistic = async payload => {
	const response = await sendRequest<
        MonetizationStatisticResponse,
        ErrorState
    >(monetizationStatisticUrl(payload));

	if (response.success) {
		return {
			state: response.result,
			error: null,
		};
	}

	if (!response.success) {
		return {
			state: {
			},
			error: response.error,
		};
	}

	return {
		state: {
		},
		error: null,
	};
};
