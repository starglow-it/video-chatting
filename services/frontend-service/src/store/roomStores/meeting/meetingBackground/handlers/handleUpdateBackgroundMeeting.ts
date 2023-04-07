import { EntityList, IUserTemplate } from 'shared-types';
import sendRequestWithCredentials from '../../../../../helpers/http/sendRequestWithCredentials';
import { updateUserTemplateUrl } from '../../../../../utils/urls';
import { ICategoryMedia } from '../types';

export const handleUpdateBackgroundMeeting = async ({
    templateId,
    data,
}: {
    templateId: string;
    data: Partial<IUserTemplate>;
}): Promise<void> => {
    await sendRequestWithCredentials<EntityList<ICategoryMedia>, void>({
        ...updateUserTemplateUrl({ templateId }),
        data,
    });
};
