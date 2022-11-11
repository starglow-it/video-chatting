import { ErrorState } from 'shared-types';
import { UserTemplate } from '../../../../types';
import { sendRequest } from '../../../../../helpers/http/sendRequest';
import { postProfileTemplatesUrl } from '../../../../../utils/urls';
import { initialTemplateState } from '../model';
import { UpdateTemplatePayload } from '../../../../profile/types';

export const handleUpdateMeetingTemplate = async ({
    templateId,
    data,
}: UpdateTemplatePayload): Promise<UserTemplate> => {
    const response = await sendRequest<UserTemplate, ErrorState>({
        ...postProfileTemplatesUrl({ templateId }),
        data,
    });

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
};
