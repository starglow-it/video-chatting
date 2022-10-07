import { UploadTemplateFilePayload, UploadTemplateFileResponse } from '../types';
import { ErrorState, Template } from '../../types';
import { generateFormData } from '../../../utils/form/generateFormData';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { updateTemplateUrl } from '../../../utils/urls';

export const handleUploadTemplateFile = async (
    data: UploadTemplateFilePayload,
): Promise<UploadTemplateFileResponse> => {
    const formData = generateFormData(data);

    const response = await sendRequestWithCredentials<Template | null, ErrorState>({
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
