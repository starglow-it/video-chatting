import { ErrorState } from 'shared-types';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { authApiMethods } from '../../../utils/urls';

export const handleConfirmRegistration = async (token: string) => {
    const confirmRegisterUserUrl = authApiMethods.confirmRegisterUserUrl();

    const response = await sendRequest<void, ErrorState>({
        ...confirmRegisterUserUrl,
        data: { token },
    });

    if (response.success) {
        return {
            isUserConfirmed: response?.success,
        };
    }
    return {
        isUserConfirmed: response?.success,
        error: response.error,
    };
};
