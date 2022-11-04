import { UserTemplate } from '../../types';
import { postProfileTemplatesUrl } from '../../../utils/urls';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { generateFormData } from '../../../utils/form/generateFormData';
import { EditUserTemplatePayload, EditUserTemplateResponse } from '../types';
import { ErrorState } from 'shared-types';

export const handleEditUserTemplate = async ({
    templateId,
    data,
}: EditUserTemplatePayload): Promise<EditUserTemplateResponse> => {
    const formData = generateFormData(data);

    const response = await sendRequestWithCredentials<UserTemplate, ErrorState>({
        ...postProfileTemplatesUrl({ templateId }),
        data: formData,
    });

    if (response.success) {
        return response.result;
    }

    return null;
};
