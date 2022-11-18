import { ErrorState, UserTemplate } from '../../../../types';
import { sendRequest } from '../../../../../helpers/http/sendRequest';
import { getMeetingTemplateUrl } from '../../../../../utils/urls';
import { initialTemplateState } from '../model';

export const handleGetMeetingTemplate = async ({
    templateId,
}: {
    templateId: UserTemplate['id'];
}): Promise<UserTemplate> => {
    const response = await sendRequest<UserTemplate, ErrorState>(
        getMeetingTemplateUrl({ templateId }),
    );

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
};
