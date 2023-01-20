import { ErrorState, ICommonTemplate } from 'shared-types';

// utils
import { updateTemplateUrl } from 'src/utils/urls';

// types
import { EditTemplatePayload, EditTemplateResponse } from '../types';

// helpers
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

export const handleEditTemplate = async ({
    templateId,
    data,
}: EditTemplatePayload): Promise<EditTemplateResponse> => {
    const response = await sendRequestWithCredentials<ICommonTemplate | null, ErrorState>({
        ...updateTemplateUrl({ templateId }),
        data: data,
    });

    if (response.success && response.result) {
        return response.result;
    }

    return null;
};
