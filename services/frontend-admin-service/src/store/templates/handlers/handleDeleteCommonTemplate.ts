import {
	DeleteCommonTemplatePayload, ErrorState 
} from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

import { deleteCommonTemplateUrl } from '../../../const/urls/templates';
import { CommonTemplateState } from '../../types';

export const handleDeleteCommonTemplate = async (
	payload: DeleteCommonTemplatePayload,
): Promise<CommonTemplateState> => {
	const response = await sendRequestWithCredentials<void, ErrorState>({
		...deleteCommonTemplateUrl(payload),
	});

	if (response.success) {
		return {
			state: undefined,
			error: null,
		};
	}

	return {
		state: undefined,
		error: response.error,
	};
};
