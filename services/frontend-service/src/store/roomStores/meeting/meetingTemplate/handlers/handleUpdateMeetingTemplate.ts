import {
    ErrorState,
    FailedResult,
    IUserTemplate,
    SuccessResult,
} from 'shared-types';
import { sendRequest } from '../../../../../helpers/http/sendRequest';
import { postProfileTemplatesUrl } from '../../../../../utils/urls';
import { UpdateTemplatePayload } from '../../../../profile/types';

export const handleUpdateMeetingTemplate = async ({
    templateId,
    data,
}: UpdateTemplatePayload): Promise<
    SuccessResult<IUserTemplate> | FailedResult<ErrorState>
> => {
        const response = await sendRequest<IUserTemplate, ErrorState>({
        ...postProfileTemplatesUrl({ templateId }),
        data,
    });

    if (response.success) {
        return response;
    }

    return response;
};
