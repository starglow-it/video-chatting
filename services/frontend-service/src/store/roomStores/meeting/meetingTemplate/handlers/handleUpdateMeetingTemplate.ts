import { ErrorState, UserTemplate } from '../../../../types';
import { sendRequest } from '../../../../../helpers/http/sendRequest';
import { postProfileTemplatesUrl } from '../../../../../utils/urls';
import { initialTemplateState } from '../model';
import { UpdateTemplatePayload } from '../../../../profile/types';
import { generateFormData } from '../../../../../utils/form/generateFormData';

export const handleUpdateMeetingTemplate = async ({
    templateId,
    data,
}: UpdateTemplatePayload): Promise<UserTemplate> => {
    const formData = generateFormData(data);
    const response = await sendRequest<UserTemplate, ErrorState>({
        ...postProfileTemplatesUrl({ templateId }),
        data: formData,
    });

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
};
