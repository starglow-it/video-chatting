import { UploadTemplateFilePayload, UploadTemplateFileResponse } from '../types';
import { ErrorState } from '../../types';
import { generateFormData } from '../../../utils/form/generateFormData';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { updateTemplateUrl } from '../../../utils/urls';

export const handleUploadTemplateFile = async ({
    templateId,
    file,
}: UploadTemplateFilePayload): Promise<UploadTemplateFileResponse> => {
    const formData = generateFormData({ file });

    const response = await sendRequestWithCredentials<UploadTemplateFileResponse, ErrorState>({
        ...updateTemplateUrl({ templateId }),
        data: formData,
    });

    if (response.success && response.result) {
        return {
            ...response.result,
        };
    }

    return null;
};
