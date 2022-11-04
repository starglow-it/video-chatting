import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { resetPasswordUrl } from '../../../utils/urls';
import { ResetPasswordPayload } from '../types';
import { ErrorState } from 'shared-types';

export const handleResetPassword = async (
    params: ResetPasswordPayload,
): Promise<ErrorState | null | undefined> => {
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
