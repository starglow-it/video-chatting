import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState } from '../../types';
import { checkResetPasswordLinkUrl } from '../../../utils/urls';

export const handleCheckResetPasswordLink = async (params: {
    token: string;
}): Promise<{ isUserConfirmed: boolean; error?: ErrorState }> => {
    const response = await sendRequestWithCredentials<void, ErrorState>({
        ...checkResetPasswordLinkUrl,
        data: params,
    });

    if (response.success) {
        return {
            isUserConfirmed: response?.success,
        };
    } else {
        return {
            isUserConfirmed: response?.success,
            error: response.error,
        };
    }
};
