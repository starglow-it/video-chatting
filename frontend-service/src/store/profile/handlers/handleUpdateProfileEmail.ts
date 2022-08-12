import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState, Profile } from '../../types';
import { profileEmailUrl } from '../../../utils/urls';

export const handleUpdateProfileEmail = async (params: {
    email: string;
}): Promise<Profile | null | undefined> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>({
        ...profileEmailUrl,
        data: params,
    });

    if (response.success) {
        return response.result;
    }
    if (!response.success) {
        return response.result;
    }
};
