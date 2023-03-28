import { ErrorState } from 'shared-types';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { Profile } from '../../types';
import { initUserWithoutTokenUrl } from '../../../utils/urls';
import { setUserWithoutTokenCookies } from '../../../helpers/http/setAuthCookies';

export const handleInitUserWithoutToken = async () => {
    const response = await sendRequest<
        { user: Profile; userTemplateId: string },
        ErrorState
    >({
        ...initUserWithoutTokenUrl,
    });
    const { result, success } = response;

    if (success && result) {
        const { user, userTemplateId } = result;
        if (user) setUserWithoutTokenCookies(user?.id, userTemplateId);
        return {
            user: user || null,
            userTemplateId: userTemplateId || '',
        };
    }

    if (!success) {
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
