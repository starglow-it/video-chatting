import { ErrorState, Profile } from '../../types';
import { deleteProfileAvatarUrl } from '../../../utils/urls';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { CommonProfileResponse } from '../types';

export const handleDeleteProfilePhoto = async (): Promise<CommonProfileResponse> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>(deleteProfileAvatarUrl);

    if (response.success) {
        return response.result;
    }
};
