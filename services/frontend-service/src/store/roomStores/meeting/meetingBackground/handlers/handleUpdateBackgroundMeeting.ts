import { EntityList } from 'shared-types';
import sendRequestWithCredentials from '../../../../../helpers/http/sendRequestWithCredentials';
import { updateUserTemplateUrl } from '../../../../../utils/urls';
import { ICategoryMedia } from '../types';

export const handleUpdateBackgroundMeeting = async ({
    templateId,
    data,
}: {
    templateId: string;
    data: any;
}): Promise<void> => {
    await sendRequestWithCredentials<EntityList<ICategoryMedia>, void>({
        ...updateUserTemplateUrl({ templateId }),
        data,
    });
};
