import { ErrorState } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { checkResetPasswordLinkUrl } from '../../../utils/urls';
import {
    CheckResetPasswordLinkPayload,
    CheckResetPasswordLinkResponse,
} from '../types';

export const handleCheckResetPasswordLink = async (
    params: CheckResetPasswordLinkPayload,
): Promise<CheckResetPasswordLinkResponse> => {
    const response = await sendRequestWithCredentials<void, ErrorState>({
        ...checkResetPasswordLinkUrl,
        data: params,
    });

    if (response.success) {
        return {
            isUserConfirmed: response?.success,
        };
    }
    return {
        isUserConfirmed: response?.success,
        error: response.error,
    };
};
