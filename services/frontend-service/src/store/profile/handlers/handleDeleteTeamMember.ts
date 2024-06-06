import { ErrorState } from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { Profile } from '../../types';
import { delteSeatTeamMemberUrl } from '../../../utils/urls';

export const handleDeleteTeamMember = async (
    params: { email: string },
): Promise<boolean> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>({
        ...delteSeatTeamMemberUrl,
        data: params,
    });

    return response.success
};
