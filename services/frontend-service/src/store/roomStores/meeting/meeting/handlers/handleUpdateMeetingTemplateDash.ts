import { EntityList, IMediaCategory, IUserTemplate } from 'shared-types';
import sendRequestWithCredentials from '../../../../../helpers/http/sendRequestWithCredentials';
import { updateUserTemplateUrl } from '../../../../../utils/urls';

export const handleUpdateMeetingTemplateDash = async ({
    templateId,
    data,
}: {
    templateId: string;
    data: Partial<IUserTemplate>;
}): Promise<void> => {
    await sendRequestWithCredentials<EntityList<IMediaCategory>, void>({
        ...updateUserTemplateUrl({ templateId }),
        data,
    });
};
