import { ErrorState, IUserTemplate } from 'shared-types';
import { postProfileTemplatesUrl } from '../../../utils/urls';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import {
    EditUserTemplatePayload,
    EditUserTemplateResponse,
} from '../../templates/types';

export const handleEditUserTemplate = async ({
    templateId,
    data,
}: EditUserTemplatePayload): Promise<EditUserTemplateResponse> => {
    const response = await sendRequestWithCredentials<
        IUserTemplate,
        ErrorState
    >({
        ...postProfileTemplatesUrl({ templateId }),
        data,
    });

    if (response.success) {
        return response.result;
    }

    return null;
};
