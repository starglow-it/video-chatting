import { ErrorState } from 'shared-types';

import { Profile } from '../../types';
import { CommonProfileResponse } from '../types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import {profileApiMethods} from "../../../utils/urls";

export const handleDeleteProfilePhoto = async (): Promise<CommonProfileResponse> => {
    const deleteProfileAvatarUrl = profileApiMethods.deleteProfileAvatarUrl();

    const response = await sendRequestWithCredentials<Profile, ErrorState>(deleteProfileAvatarUrl);

    if (response.success) {
        return response.result;
    }
};
