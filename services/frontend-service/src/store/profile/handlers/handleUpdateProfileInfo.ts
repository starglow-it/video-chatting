import { ErrorState } from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { Profile } from '../../types';
import { profileApiMethods } from '../../../utils/urls';
import { CommonProfileResponse, UpdateProfilePayload } from '../types';

export const handleUpdateProfileInfo = async (
    params: UpdateProfilePayload,
): Promise<CommonProfileResponse> => {
    const postProfileUrl = profileApiMethods.postProfileUrl();

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
