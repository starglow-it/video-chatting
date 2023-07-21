import { ErrorState, IUserTemplate } from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import {
    AddTemplateToUserEffectPayload,
    AddTemplateToUserEffectResponse,
} from '../types';
import { addTemplateToUserUrl } from '../../../utils/urls';

export const handleAddTemplateToUser = async ({
    templateId,
}: AddTemplateToUserEffectPayload): Promise<AddTemplateToUserEffectResponse> => {
    const response = await sendRequestWithCredentials<
        IUserTemplate,
        ErrorState
    >(addTemplateToUserUrl({ templateId }));

    if (response.success) {
        return response.result;
    }

    return null;
};
