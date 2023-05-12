import { ErrorState } from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { Profile } from '../../types';
import { postProfileUrl } from '../../../utils/urls';
import { CommonProfileResponse, UpdateProfilePayload } from '../types';

export const handleUpdateProfileInfo = async (
    params: UpdateProfilePayload,
): Promise<{ profile: CommonProfileResponse; error: ErrorState }> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>({
        ...postProfileUrl,
        data: params,
    });

    if (response.success) {
        return { profile: response.result, error: response.error };
    }
    if (!response.success) {
        return { profile: response.result, error: response.error };
    }
};
