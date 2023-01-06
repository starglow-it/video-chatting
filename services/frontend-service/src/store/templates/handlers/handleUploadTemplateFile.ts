import {ErrorState, ICommonTemplate} from "shared-types";

import { UploadTemplateFilePayload, UploadTemplateFileResponse } from '../types';
import { generateFormData } from '../../../utils/form/generateFormData';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { templatesApiMethods } from '../../../utils/urls';

export const handleUploadTemplateFile = async ({ templateId, file, ...params }: UploadTemplateFilePayload): Promise<UploadTemplateFileResponse> => {
    if (templateId) {
        const formData = generateFormData({
            file,
        });

        const uploadCommonTemplateBackgroundUrl = templatesApiMethods.uploadCommonTemplateBackgroundUrl({ templateId }, params)

        const response = await sendRequestWithCredentials<
            ICommonTemplate,
            ErrorState
        >({
            ...uploadCommonTemplateBackgroundUrl,
            data: formData,
        });

        if (response.success && response.result) {
            return response.result;
        }
    }

    return null;
};
