import {ErrorState, IUserTemplate} from 'shared-types';
import { generateFormData } from '../../../utils/form/generateFormData';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { updateUserTemplateUrl } from '../../../utils/urls';
import { UploadUserTemplateFilePayload, UploadUserTemplateFileResponse } from '../types';

export const handleUploadUserTemplateFile = async (
    data: UploadUserTemplateFilePayload,
): Promise<UploadUserTemplateFileResponse> => {
    const formData = generateFormData(data);

    const response = await sendRequestWithCredentials<IUserTemplate, ErrorState>({
        ...updateUserTemplateUrl({ templateId: data.templateId }),
        data: formData,
    });

    if (response.success && response.result) {
        return {
            ...response.result,
        };
    }

    return null;
};
