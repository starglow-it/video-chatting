import { ErrorState, UserTemplate } from '../../types';
import { postProfileTemplatesUrl } from '../../../utils/urls';
import { initialTemplateState } from '../../meeting/meetingTemplate/model';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { UpdateTemplatePayload } from '../types';

export const handleUpdateProfileTemplate = async ({
    templateId,
    data,
}: UpdateTemplatePayload): Promise<UserTemplate> => {
    const response = await sendRequestWithCredentials<UserTemplate, ErrorState>({
        ...postProfileTemplatesUrl({ templateId }),
        data,
    });

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
};
