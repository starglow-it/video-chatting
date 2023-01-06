import { ErrorState, IUserTemplate } from '../../../../types';
import { sendRequest } from '../../../../../helpers/http/sendRequest';
import { initialTemplateState } from '../model';
import {meetingsApiMethods} from "../../../../../utils/urls";


export const handleGetMeetingTemplate = async ({
    templateId,
}: {
    templateId: IUserTemplate['id'];
}): Promise<IUserTemplate> => {
    const getMeetingTemplateUrl = meetingsApiMethods.getMeetingTemplateUrl({ templateId });

    const response = await sendRequest<IUserTemplate, ErrorState>(getMeetingTemplateUrl);

    if (response.success) {
        return response.result;
    }

    return initialTemplateState;
};
