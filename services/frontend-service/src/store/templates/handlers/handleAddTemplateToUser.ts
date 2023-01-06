import {ErrorState, IUserTemplate} from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { AddTemplateToUserEffectPayload, AddTemplateToUserEffectResponse } from '../types';
import { profileApiMethods } from '../../../utils/urls';

export const handleAddTemplateToUser = async ({
    templateId,
}: AddTemplateToUserEffectPayload): Promise<AddTemplateToUserEffectResponse> => {
    if (templateId) {
        const addTemplateToUserUrl = profileApiMethods.addTemplateToUserUrl({ templateId });

        const response = await sendRequestWithCredentials<IUserTemplate, ErrorState>(
            addTemplateToUserUrl,
        );

        if (response.success && response.result) {
            return response.result;
        }
    }

    return null;
};
