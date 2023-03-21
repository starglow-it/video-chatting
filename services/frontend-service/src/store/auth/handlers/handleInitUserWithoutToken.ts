import { ErrorState } from 'shared-types';
import {
    StorageKeysEnum,
    WebStorage,
} from '../../../controllers/WebStorageController';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { Profile } from '../../types';
import { initUserWithoutTokenUrl } from '../../../utils/urls';

export const handleInitUserWithoutToken = async () => {
    const response = await sendRequest<
        { user: Profile; userTemplateId: string },
        ErrorState
    >({
        ...initUserWithoutTokenUrl,
    });
    const { result } = response;
    if (result?.user)
        WebStorage.save({
            key: StorageKeysEnum.userWithoutLoginId,
            data: result?.user.id,
        });

    if (response.success && response.result) {
        return {
            user: result?.user || null,
            userTemplateId: result?.userTemplateId || '',
        };
    }

    if (!response.success) {
        return {
            user: null,
            userTemplateId: '',
        };
    }

    return {
        user: null,
        userTemplateId: '',
    };
};
