import { generateFormData } from '../../../utils/form/generateFormData';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState, UserTemplate } from '../../types';
import { updateTemplateUrl } from '../../../utils/urls';
import { UploadUserTemplateFilePayload, UploadUserTemplateFileResponse } from '../types';

export const handleUploadUserTemplateFile = async (
    data: UploadUserTemplateFilePayload,
): Promise<UploadUserTemplateFileResponse> => {
    const formData = generateFormData(data);

    const response = await sendRequestWithCredentials<UserTemplate, ErrorState>({
        ...updateTemplateUrl,
        data: formData,
    });

    if (response.success && response.result) {
        return {
            ...response.result,
        };
    }

    return null;
};
