import { ErrorState, IUserTemplate } from 'shared-types';

import { postProfileTemplatesUrl } from '../../../utils/urls';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { UpdateTemplatePayload } from '../types';

export const handleUpdateProfileTemplate = async ({
    templateId,
    data,
}: UpdateTemplatePayload): Promise<IUserTemplate | null> => {
    const response = await sendRequestWithCredentials<
        IUserTemplate,
        ErrorState
    >({
        ...postProfileTemplatesUrl({ templateId }),
        data,
    });

    if (response.success) {
        return response.result;
    }

    return null;
};
