import { ErrorState } from 'shared-types';

import { Profile } from '../../types';
import { CommonProfileResponse } from '../types';

import { deleteProfileAvatarUrl } from '../../../utils/urls';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

export const handleDeleteProfilePhoto =
    async (): Promise<CommonProfileResponse> => {
        const response = await sendRequestWithCredentials<Profile, ErrorState>(
            deleteProfileAvatarUrl,
        );

        if (response.success) {
            return response.result;
        }
    };
