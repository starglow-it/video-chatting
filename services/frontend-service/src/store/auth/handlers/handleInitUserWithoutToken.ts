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
        authRequest: true,
    });
    const { result } = response;
    if (result?.user)
        setUserWithoutTokenCookies(result?.user.id, result?.userTemplateId);

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
