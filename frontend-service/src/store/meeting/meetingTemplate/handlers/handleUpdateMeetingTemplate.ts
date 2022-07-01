import {ErrorState, UpdateTemplateData, UserTemplate} from '../../../types';
import { sendRequest } from '../../../../helpers/http/sendRequest';
import { postProfileTemplatesUrl } from '../../../../utils/urls';
import { initialTemplateState } from '../model';

export const handleUpdateMeetingTemplate = async ({
    templateId,
    data,
}: UpdateTemplateData): Promise<UserTemplate> => {
    const response = await sendRequest<UserTemplate, ErrorState>({
        ...postProfileTemplatesUrl({ templateId }),
        data,
    });

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
};
