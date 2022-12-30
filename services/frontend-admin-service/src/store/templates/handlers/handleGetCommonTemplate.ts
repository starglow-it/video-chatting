import {
	ErrorState,
	GetCommonTemplateByIdPayload,
	ICommonTemplate,
} from 'shared-types';
import { CommonTemplateState } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getCommonTemplateUrl } from '../../../const/urls/templates';

export const handleGetCommonTemplate = async (
	params: GetCommonTemplateByIdPayload,
): Promise<CommonTemplateState> => {
	const response = await sendRequestWithCredentials<
        ICommonTemplate,
        ErrorState
    >(getCommonTemplateUrl(params));

	if (response.success) {
		return {
			state: response.result,
			error: null,
		};
	}

	return {
		state: undefined,
		error: response.error,
	};
};
