import { ErrorState } from 'shared-types';

import { UserTemplate } from '../../types';
import { userTemplateUrl } from '../../../utils/urls';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { GetUserTemplateByIdPayload } from '../types';

export const handleGetUserTemplate = async ({
    templateId,
}: GetUserTemplateByIdPayload): Promise<UserTemplate | undefined | null> => {
    const response = await sendRequest<UserTemplate, ErrorState>(userTemplateUrl({ templateId }));

    if (!response.success) {
        return response.result;
    }

    return response.result;
};
