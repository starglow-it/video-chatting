import {ErrorState, IUserTemplate} from 'shared-types';
import { sendRequest } from '../../../../../helpers/http/sendRequest';
import { profileApiMethods } from '../../../../../utils/urls';
import { initialTemplateState } from '../model';
import { UpdateTemplatePayload } from '../../../../profile/types';

export const handleUpdateMeetingTemplate = async ({
    templateId,
    data,
}: UpdateTemplatePayload): Promise<IUserTemplate> => {
    const postProfileTemplatesUrl = profileApiMethods.postProfileTemplatesUrl({ templateId });

    const response = await sendRequest<IUserTemplate, ErrorState>({
        ...postProfileTemplatesUrl,
        data,
    });

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
};
