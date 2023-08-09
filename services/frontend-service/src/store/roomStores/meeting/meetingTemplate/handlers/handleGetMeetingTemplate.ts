import { ErrorState, IUserTemplate } from 'shared-types';
import { sendRequest } from '../../../../../helpers/http/sendRequest';
import { getMeetingTemplateUrl } from '../../../../../utils/urls';
import { initialTemplateState } from '../model';

export const handleGetMeetingTemplate = async ({
    templateId,
    subdomain,
}: {
    templateId: IUserTemplate['id'];
    subdomain?: IUserTemplate['subdomain'];
}): Promise<IUserTemplate> => {
    const response = await sendRequest<IUserTemplate, ErrorState>({
        ...getMeetingTemplateUrl({ templateId }),
        data: {
            subdomain,
        },
    });

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
};
