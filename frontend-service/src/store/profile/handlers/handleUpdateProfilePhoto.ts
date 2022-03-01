import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { profileAvatarUrl, uploadProfileAvatarUrl } from '../../../utils/urls/resolveUrl';
import { sendRequest } from '../../../helpers/http/sendRequest';

import { ErrorState, Profile, HttpMethods, UpdateProfileAvatar } from '../../types';

export const handleUpdateProfilePhoto = async ({
    file,
}: UpdateProfileAvatar): Promise<Profile | undefined | null> => {
    const formData = new FormData();

    formData.append('profileAvatar', file, file.name);

    const { result } = await sendRequest(uploadProfileAvatarUrl, {
        method: HttpMethods.Post,
        data: formData,
    });

    const response = await sendRequestWithCredentials<Profile, ErrorState>(profileAvatarUrl, {
        method: HttpMethods.Post,
        data: {
            profileAvatar: result,
            size: file.size,
            mimeType: file.type,
        },
    });

    if (response.success) {
        return response.result;
    } else if (!response.success) {
        return response.result;
    }
};
