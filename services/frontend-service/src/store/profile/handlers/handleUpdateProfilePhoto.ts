import { ErrorState } from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { profileApiMethods } from '../../../utils/urls';
import { sendRequest } from '../../../helpers/http/sendRequest';

import { Profile, UpdateProfileAvatar } from '../../types';
import { CommonProfileResponse } from '../types';

export const handleUpdateProfilePhoto = async ({
    file,
}: UpdateProfileAvatar): Promise<CommonProfileResponse> => {
    const postProfileAvatarUrl = profileApiMethods.postProfileAvatarUrl();
    const uploadProfileAvatarUrl = profileApiMethods.uploadProfileAvatarUrl();

    const formData = new FormData();

    formData.append('profileAvatar', file, file.name);

    const { result } = await sendRequest({
        ...uploadProfileAvatarUrl,
        data: formData,
    });

    const response = await sendRequestWithCredentials<Profile, ErrorState>({
        ...postProfileAvatarUrl,
        data: {
            profileAvatar: result,
            size: file.size,
            mimeType: file.type,
        },
    });

    if (response.success) {
        return response.result;
    }
    if (!response.success) {
        return response.result;
    }
};
