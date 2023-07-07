import { EntityList, IMediaCategory, IUserTemplate } from 'shared-types';
import {
    StorageKeysEnum,
    WebStorage,
} from 'src/controllers/WebStorageController';
import sendRequestWithCredentials from '../../../../../helpers/http/sendRequestWithCredentials';
import { updateUserTemplateUrl } from '../../../../../utils/urls';

export const handleUpdateBackgroundMeeting = async ({
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
    WebStorage.save({
        key: StorageKeysEnum.bgLastCall,
        data: {
            templateUrl: data.url,
            templateType: data.templateType,
        },
    });
};
