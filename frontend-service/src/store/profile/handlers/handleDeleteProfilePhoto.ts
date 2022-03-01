import { ErrorState, HttpMethods, Profile } from '../../types';
import { profileAvatarUrl } from '../../../utils/urls/resolveUrl';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

export const handleDeleteProfilePhoto = async (): Promise<Profile | null | undefined> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>(profileAvatarUrl, {
        method: HttpMethods.Delete,
    });

    if (response.success) {
        return response.result;
    }

    return;
};
