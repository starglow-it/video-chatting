import {
	ErrorState,
	ICommonTemplate,
	UploadCommonTemplateFilePayload,
} from 'shared-types';

import { generateFormData } from 'shared-utils';

import { CommonTemplateState } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { uploadCommonTemplateSoundUrl } from '../../../const/urls/templates';

export const handleUploadCommonTemplateSound = async (
	params: UploadCommonTemplateFilePayload,
): Promise<CommonTemplateState> => {
	const formData = generateFormData({
		file: params.file,
	});

	const response = await sendRequestWithCredentials<
        ICommonTemplate,
        ErrorState
    >({
    	...uploadCommonTemplateSoundUrl(params),
    	data: formData,
    });

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
