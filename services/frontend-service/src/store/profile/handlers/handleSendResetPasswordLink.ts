import { ErrorState } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { Profile } from '../../types';
import { sendResetPasswordLinkUrl } from '../../../utils/urls';
import { SendResetPasswordLinkEmailPayload } from '../types';

export const handleSendResetPasswordLink = async (
    params: SendResetPasswordLinkEmailPayload,
): Promise<void> => {
    await sendRequestWithCredentials<Profile, ErrorState>({
        ...sendResetPasswordLinkUrl,
        data: params,
    });
};
