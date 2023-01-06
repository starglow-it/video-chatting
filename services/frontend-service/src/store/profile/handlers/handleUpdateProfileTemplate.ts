import {ErrorState, IUserTemplate} from 'shared-types';

import { profileApiMethods} from '../../../utils/urls';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { UpdateTemplatePayload } from '../types';

export const handleUpdateProfileTemplate = async ({
    templateId,
    data,
}: UpdateTemplatePayload): Promise<IUserTemplate | null> => {
    const postProfileTemplatesUrl = profileApiMethods.postProfileTemplatesUrl({ templateId });

    const response = await sendRequestWithCredentials<IUserTemplate, ErrorState>({
        ...postProfileTemplatesUrl,
        data,
    });

    if (response.success) {
        return response.result;
    }

    return null;
};
