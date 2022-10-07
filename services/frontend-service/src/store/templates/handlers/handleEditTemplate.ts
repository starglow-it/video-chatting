// utils
import { updateTemplateUrl } from 'src/utils/urls';
import { generateFormData } from 'src/utils/form/generateFormData';

// types
import { ErrorState, Template } from '../../types';
import { EditTemplatePayload } from '../types';

// helpers
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

export const handleEditTemplate = async (data: EditTemplatePayload): Promise<Template | null> => {
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
