import { ErrorState, IUserTemplate } from '../../../../types';
import { sendRequest } from '../../../../../helpers/http/sendRequest';
import { getMeetingTemplateUrl } from '../../../../../utils/urls';
import { initialTemplateState } from '../model';

export const handleGetMeetingTemplate = async ({
    templateId,
}: {
    templateId: IUserTemplate['id'];
}): Promise<IUserTemplate> => {
    const response = await sendRequest<IUserTemplate, ErrorState>(
        getMeetingTemplateUrl({ templateId }),
    );

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
};
