import { ErrorState, ICommonTemplate } from 'shared-types';

// utils
import { templatesApiMethods } from 'src/utils/urls';

// types
import { EditTemplatePayload, EditTemplateResponse } from '../types';

// helpers
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

export const handleEditTemplate = async ({
    templateId,
    data,
}: EditTemplatePayload): Promise<EditTemplateResponse> => {
    if (templateId) {
        const updateTemplateUrl = templatesApiMethods.updateTemplateUrl({ templateId });

        const response = await sendRequestWithCredentials<ICommonTemplate | null, ErrorState>({
            ...updateTemplateUrl,
            data: data,
        });

        if (response.success && response.result) {
            return response.result;
        }
    }

    return null;
};
