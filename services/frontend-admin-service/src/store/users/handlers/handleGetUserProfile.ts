import { ErrorState, ICommonUser } from 'shared-types';

import { GetUserProfileParams, UserProfileState } from '../../types';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { userProfileUrl } from '../../../const/urls/users';

export const handleGetUserProfile = async (
    payload: GetUserProfileParams,
): Promise<UserProfileState> => {
    const response = await sendRequest<ICommonUser, ErrorState>(userProfileUrl(payload));

    if (response.success) {
        return {
            state: response.result,
            error: null,
        };
    }

    if (!response.success) {
        return {
            state: null,
            error: response.error,
        };
    }

    return {
        state: null,
        error: null,
    };
};
