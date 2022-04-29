import { ErrorState, Profile } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { profilePasswordUrl } from '../../../utils/urls';

export const handleUpdateProfilePassword = async (params: {
    currentPassword: string;
    newPassword: string;
    newPasswordRepeat: string;
}): Promise<Profile | ErrorState | null | undefined> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>({
        ...profilePasswordUrl,
        data: params,
    });

    if (response.success) {
        return response.result;
    } else if (!response.success) {
        return response.error;
    }
};
