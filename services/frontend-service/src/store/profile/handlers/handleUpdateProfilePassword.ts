import { ErrorState } from 'shared-types';

import { Profile } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { profileApiMethods } from '../../../utils/urls';
import { CommonProfileResponse, UpdateProfilePasswordPayload } from '../types';

export const handleUpdateProfilePassword = async (
    params: UpdateProfilePasswordPayload,
): Promise<CommonProfileResponse | ErrorState> => {
    const profilePasswordUrl = profileApiMethods.profilePasswordUrl();

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
