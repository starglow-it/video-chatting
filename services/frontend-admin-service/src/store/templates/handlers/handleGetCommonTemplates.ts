import {
	CommonTemplatesList, ErrorState, QueryParams 
} from 'shared-types';
import {
	CommonTemplatesListState 
} from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import {
	getTemplatesUrl 
} from '../../../const/urls/templates';

export const handleGetCommonTemplates = async (
	payload: QueryParams,
): Promise<CommonTemplatesListState> => {
	const response = await sendRequestWithCredentials<
        CommonTemplatesList,
        ErrorState
    >(getTemplatesUrl(payload));

	if (response.success) {
		return {
			error: null,
			state: response.result!,
		};
	}

	if (!response.success) {
		return {
			error: null,
			state: response.result!,
		};
	}

	return {
		state: {
			list: [],
			count: 0,
		},
		error: null,
	};
};
