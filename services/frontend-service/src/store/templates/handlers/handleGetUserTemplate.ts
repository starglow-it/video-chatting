import { ErrorState, UserTemplate } from '../../types';
import { getUserTemplateUrl } from '../../../utils/urls';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { GetUserTemplateByIdPayload } from '../types';

export const handleGetUserTemplate = async ({
    templateId,
}: GetUserTemplateByIdPayload): Promise<UserTemplate | undefined | null> => {
    const response = await sendRequest<UserTemplate, ErrorState>(
        getUserTemplateUrl({ templateId }),
    );

    if (!response.success) {
        return response.result;
    }

    return response.result;
};
