import { ErrorState } from 'shared-types';
import { Profile } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { profileApiMethods } from '../../../utils/urls';
import { CommonProfileResponse } from '../types';

export const handleGetProfile = async (): Promise<CommonProfileResponse> => {
    const getProfileUrl = profileApiMethods.getProfileUrl();

    const response = await sendRequestWithCredentials<Profile, ErrorState>(getProfileUrl);

    if (response.success) {
        return response.result;
    }
    if (!response.success) {
        return response.result;
    }
};
