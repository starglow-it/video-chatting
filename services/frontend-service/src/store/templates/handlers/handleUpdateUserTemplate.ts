import { ErrorState, UserTemplate } from '../../types';
import { postProfileTemplatesUrl } from '../../../utils/urls';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { generateFormData } from '../../../utils/form/generateFormData';
import { EditUserTemplatePayload } from '../types';

export const handleUpdateUserTemplate = async ({
    templateId,
    data,
}: EditUserTemplatePayload): Promise<UserTemplate | null> => {
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
