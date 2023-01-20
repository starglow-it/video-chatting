import {ErrorState, IUserTemplate} from 'shared-types';

import { userTemplateByIdUrl } from '../../../utils/urls';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { GetUserTemplateByIdPayload } from '../types';

export const handleGetUserTemplate = async ({
    templateId,
}: GetUserTemplateByIdPayload): Promise<IUserTemplate | undefined | null> => {
    const response = await sendRequest<IUserTemplate, ErrorState>(userTemplateByIdUrl({ templateId }));

    if (!response.success) {
        return response.result;
    }

    return response.result;
};
