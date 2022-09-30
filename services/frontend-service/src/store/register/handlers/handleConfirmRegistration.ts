import { sendRequest } from '../../../helpers/http/sendRequest';
import { ErrorState } from '../../types';
import { confirmRegisterUserUrl } from '../../../utils/urls';

export const handleConfirmRegistration = async (token: string) => {
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
