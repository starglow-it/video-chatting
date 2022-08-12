import { ErrorState, Profile } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getProfileUrl } from '../../../utils/urls';

export const handleGetProfile = async (): Promise<Profile | null | undefined> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>(getProfileUrl);

    if (response.success) {
        return response.result;
    }
    if (!response.success) {
        return response.result;
    }
};
