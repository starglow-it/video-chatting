import { ErrorState, HttpMethods, Template, UpdateTemplateData } from '../../types';
import { updateUserTemplateUrl } from '../../../utils/urls/resolveUrl';
import { initialTemplateState } from '../../meeting';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

export const handleUpdateProfileTemplate = async ({
    templateId,
    userId,
    data,
}: UpdateTemplateData): Promise<Template> => {
    const response = await sendRequestWithCredentials<Template, ErrorState>(
        updateUserTemplateUrl({ templateId, userId }),
        {
            method: HttpMethods.Post,
            data,
        },
    );

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
};
