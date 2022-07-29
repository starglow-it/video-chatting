import { ErrorState, UserTemplate } from '../../../types';
import { sendRequest } from '../../../../helpers/http/sendRequest';
import { getUserTemplatesUrl } from '../../../../utils/urls';
import { initialTemplateState } from '../model';

export const handleGetMeetingTemplate = async ({
    templateId,
}: {
    templateId: UserTemplate['id'];
}): Promise<UserTemplate> => {
    const response = await sendRequest<UserTemplate, ErrorState>(
        getUserTemplatesUrl({ templateId }),
    );

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
};
