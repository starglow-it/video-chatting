import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { profileUrl } from '../../../utils/urls/resolveUrl';
import { UpdateProfileInfo, Profile, HttpMethods, ErrorState } from '../../types';

export const handleUpdateProfileInfo = async (
    params: UpdateProfileInfo,
): Promise<Profile | null | undefined> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>(profileUrl, {
        method: HttpMethods.Post,
        data: params,
    });

    if (response.success) {
        return response.result;
    } else if (!response.success) {
        return response.result;
    }
};
