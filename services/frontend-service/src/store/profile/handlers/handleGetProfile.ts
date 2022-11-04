import { Profile } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getProfileUrl } from '../../../utils/urls';
import { CommonProfileResponse } from '../types';
import { ErrorState } from 'shared-types';

export const handleGetProfile = async (): Promise<CommonProfileResponse> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>(getProfileUrl);

    if (response.success) {
        return response.result;
    }
    if (!response.success) {
        return response.result;
    }
};
