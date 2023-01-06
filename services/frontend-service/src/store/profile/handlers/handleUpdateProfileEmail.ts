import { ErrorState } from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { Profile } from '../../types';
import { profileApiMethods } from '../../../utils/urls';
import { CommonProfileResponse, UpdateProfileEmailPayload } from '../types';

export const handleUpdateProfileEmail = async (
    params: UpdateProfileEmailPayload,
): Promise<CommonProfileResponse> => {
    const profileEmailUrl = profileApiMethods.profileEmailUrl();

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
