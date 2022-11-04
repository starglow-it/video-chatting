import { ErrorState } from 'shared-types';

import { UserTemplate } from '../../types';
import { postProfileTemplatesUrl } from '../../../utils/urls';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { UpdateTemplatePayload } from '../types';

export const handleUpdateProfileTemplate = async ({
    templateId,
    data,
}: UpdateTemplatePayload): Promise<UserTemplate | null> => {
    const response = await sendRequestWithCredentials<UserTemplate, ErrorState>({
        ...postProfileTemplatesUrl({ templateId }),
        data,
    });

    if (response.success) {
        return response.result;
    }

    return null;
};
