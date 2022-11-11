import { ErrorState } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { resetTrialNotificationUrl } from '../../../utils/urls';
import { Profile } from '../../types';

export const handleResetTrialExpiredNotification = async () => {
    const response = await sendRequestWithCredentials<Profile, ErrorState>({
        ...resetTrialNotificationUrl,
    });

    if (response.success) {
        return response.result;
    }
    if (!response.success) {
        return response.result;
    }
};
