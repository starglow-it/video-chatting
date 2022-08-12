import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { postProfileAvatarUrl, uploadProfileAvatarUrl } from '../../../utils/urls';
import { sendRequest } from '../../../helpers/http/sendRequest';

import { ErrorState, Profile, UpdateProfileAvatar } from '../../types';

export const handleUpdateProfilePhoto = async ({
    file,
}: UpdateProfileAvatar): Promise<Profile | undefined | null> => {
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
