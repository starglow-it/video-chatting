import {ErrorState, IUserTemplate} from 'shared-types';
import { profileApiMethods } from '../../../utils/urls';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import {EditUserTemplatePayload, EditUserTemplateResponse} from "../../templates/types";

export const handleEditUserTemplate = async ({
    templateId,
    data,
}: EditUserTemplatePayload): Promise<EditUserTemplateResponse> => {
    const postProfileTemplatesUrl = profileApiMethods.postProfileTemplatesUrl({ templateId });

    const response = await sendRequestWithCredentials<IUserTemplate, ErrorState>({
        ...postProfileTemplatesUrl,
        data: data,
    });

    if (response.success) {
        return response.result;
    }

    return null;
};
