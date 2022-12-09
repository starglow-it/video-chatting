import {ErrorState, IUserTemplate} from 'shared-types';

import { userTemplateUrl } from '../../../utils/urls';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { GetUserTemplateByIdPayload } from '../types';

export const handleGetUserTemplate = async ({
    templateId,
}: GetUserTemplateByIdPayload): Promise<IUserTemplate | undefined | null> => {
    const response = await sendRequest<IUserTemplate, ErrorState>(userTemplateUrl({ templateId }));

    if (!response.success) {
        return response.result;
    }

    return response.result;
};
