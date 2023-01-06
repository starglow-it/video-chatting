import { ErrorState } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { authApiMethods } from '../../../utils/urls';
import { ResetPasswordPayload } from '../types';

export const handleResetPassword = async (
    params: ResetPasswordPayload,
): Promise<ErrorState | null | undefined> => {
    const resetPasswordUrl = authApiMethods.resetPasswordUrl();

    const response = await sendRequestWithCredentials<null | undefined, ErrorState>({
        ...resetPasswordUrl,
        data: params,
    });

    if (response.success) {
        return response.result;
    }
    if (!response.success) {
        return response.error;
    }
};
