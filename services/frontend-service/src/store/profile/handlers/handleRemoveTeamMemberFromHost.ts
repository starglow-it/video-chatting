import { ErrorState } from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { Profile } from '../../types';
import { removeTeamMemberFromHost } from '../../../utils/urls';

export const handleRemoveTeamMemberFromHost = async (
    params: { orgEmails: string[], memberEmail: string },
): Promise<boolean> => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>({
        ...removeTeamMemberFromHost,
        data: params,
    });

    return response.success
};
