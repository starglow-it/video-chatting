import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { Profile, ErrorState } from '../../types';
import { postProfileUrl } from '../../../utils/urls';
import { CommonProfileResponse, UpdateProfilePayload } from '../types';

export const handleUpdateProfileInfo = async (
    params: UpdateProfilePayload,
): Promise<CommonProfileResponse> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>({
        ...postProfileUrl,
        data: params,
    });

    if (response.success) {
        return response.result;
    }
    if (!response.success) {
        return response.result;
    }
};
