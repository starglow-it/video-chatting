import { ErrorState, ICommonTemplate } from 'shared-types';

// utils
import { updateTemplateUrl } from 'src/utils/urls';
import { generateFormData } from 'src/utils/form/generateFormData';

// types
import { EditTemplatePayload, EditTemplateResponse } from '../types';

// helpers
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

export const handleEditTemplate = async ({
    templateId,
    data,
}: EditTemplatePayload): Promise<EditTemplateResponse> => {
    const formData = generateFormData(data);

    const response = await sendRequestWithCredentials<ICommonTemplate | null, ErrorState>({
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
