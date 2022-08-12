import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState } from '../../types';
import { resetPasswordUrl } from '../../../utils/urls';

export const handleResetPassword = async (params: {
    newPassword: string;
    newPasswordRepeat: string;
    token: string;
}): Promise<ErrorState | null | undefined> => {
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
