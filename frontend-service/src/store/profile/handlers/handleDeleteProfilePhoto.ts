import { ErrorState, Profile } from '../../types';
import { deleteProfileAvatarUrl } from '../../../utils/urls';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

export const handleDeleteProfilePhoto = async (): Promise<Profile | null | undefined> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>(deleteProfileAvatarUrl);

    if (response.success) {
        return response.result;
    }

    return;
};
