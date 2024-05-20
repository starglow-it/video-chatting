import { ErrorState, IUserTemplate } from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { sendEmailToInviteNewTeamMemberUrl } from '../../../utils/urls';

export const handleSendEmailToInviteNewTeamMember = async ({ email, hostEmail }: { email: string, hostEmail: string }): Promise<boolean> => {
    const response = await sendRequestWithCredentials<
        IUserTemplate,
        ErrorState
    >({
        ...sendEmailToInviteNewTeamMemberUrl,
        data: {
            userEmail: email,
            hostEmail: hostEmail
        },
    });

    if (response.success) {
        return true;
    }

    return false;
};
