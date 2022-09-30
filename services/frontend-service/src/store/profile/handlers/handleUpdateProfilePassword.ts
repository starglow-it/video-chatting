import { ErrorState, Profile } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { profilePasswordUrl } from '../../../utils/urls';
import { CommonProfileResponse, UpdateProfilePasswordPayload } from '../types';

export const handleUpdateProfilePassword = async (
    params: UpdateProfilePasswordPayload,
): Promise<CommonProfileResponse | ErrorState> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>({
        ...profilePasswordUrl,
        data: params,
    });

    if (response.success) {
        return response.result;
    }
    if (!response.success) {
        return response.error;
    }
};
