import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState } from '../../types';
import { getSubscriptionUrl } from '../../../utils/urls';
import { GetSubscriptionPayload } from '../subscription/types';

export const handleGetSubscription = async ({ subscriptionId }: GetSubscriptionPayload) => {
    if (subscriptionId) {
        const response = await sendRequestWithCredentials<unknown, ErrorState>({
            ...getSubscriptionUrl({ subscriptionId }),
        });

        if (response.success) {
            return response.result;
        }
    }
};
