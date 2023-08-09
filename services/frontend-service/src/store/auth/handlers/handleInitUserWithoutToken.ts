import { ErrorState } from 'shared-types';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { Profile } from '../../types';
import { initUserWithoutTokenUrl } from '../../../utils/urls';
import { setUserWithoutTokenCookies } from '../../../helpers/http/setAuthCookies';
import { InitUserPayload } from '../type';

export const handleInitUserWithoutToken = async ({
    templateId,
    subdomain,
}: InitUserPayload) => {
    const response = await sendRequest<
        { user: Profile; userTemplateId: string },
        ErrorState
    >({
        ...initUserWithoutTokenUrl,
        data: {
            templateId,
            subdomain,
        },
    });
    const { result, success } = response;

    if (success && result) {
        const { user, userTemplateId } = result;
        if (user) setUserWithoutTokenCookies(user?.id, userTemplateId);
        return {
            user: user || null,
            userTemplateId: userTemplateId || '',
            subdomain,
        };
    }

    if (!success) {
        return {
            user: null,
            userTemplateId: '',
            subdomain,
        };
    }

    return {
        user: null,
        userTemplateId: '',
        subdomain,
    };
};
