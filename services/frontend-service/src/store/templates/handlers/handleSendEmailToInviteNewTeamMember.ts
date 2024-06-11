import { ErrorState, IUserTemplate } from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { sendEmailToInviteNewTeamMemberUrl } from '../../../utils/urls';

export const handleSendEmailToInviteNewTeamMember = async ({ email, hostEmail, seat }: { email: string, hostEmail: string, seat: string }): Promise<{ success: boolean, message: string }> => {
    const { result } = await sendRequestWithCredentials<
        IUserTemplate,
        ErrorState
    >({
        ...sendEmailToInviteNewTeamMemberUrl,
        data: {
            userEmail: email,
            hostEmail: hostEmail,
            seat
        },
    });

    return result;
};
