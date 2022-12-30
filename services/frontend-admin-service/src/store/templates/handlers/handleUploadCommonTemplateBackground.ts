import {
	UploadCommonTemplateFilePayload,
	ErrorState,
	ICommonTemplate,
} from 'shared-types';
import { generateFormData } from 'shared-utils';

import { CommonTemplateState } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { uploadCommonTemplateBackgroundUrl } from '../../../const/urls/templates';

export const handleUploadCommonTemplateBackground = async (
	params: UploadCommonTemplateFilePayload,
): Promise<CommonTemplateState> => {
	const formData = generateFormData({
		file: params.file,
	});

	const response = await sendRequestWithCredentials<
        ICommonTemplate,
        ErrorState
    >({
    	...uploadCommonTemplateBackgroundUrl(params),
    	data: formData,
    });

	if (response.success && response.result) {
		return {
			state: response.result,
			error: null,
		};
	}
	return {
		state: undefined,
		error: null,
	};
};
