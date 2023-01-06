import {ErrorState, IUserTemplate} from 'shared-types';
import { generateFormData } from '../../../utils/form/generateFormData';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { profileApiMethods } from '../../../utils/urls';
import { UploadUserTemplateFilePayload, UploadUserTemplateFileResponse } from '../types';

export const handleUploadUserTemplateFile = async (
    params: UploadUserTemplateFilePayload,
): Promise<UploadUserTemplateFileResponse> => {
    const formData = generateFormData({
        file: params.file,
    });

    const updateProfileTemplateBackgroundUrl = profileApiMethods.updateProfileTemplateBackgroundUrl(
        { templateId: params.templateId },
        { uploadKey: params.uploadKey }
    );

    const response = await sendRequestWithCredentials<IUserTemplate, ErrorState>({
        ...updateProfileTemplateBackgroundUrl,
        data: formData,
    });

    if (response.success && response.result) {
        return response.result;
    }

    return null;
};
