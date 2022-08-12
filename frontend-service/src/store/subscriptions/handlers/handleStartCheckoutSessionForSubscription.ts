import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState } from '../../types';
import { startCheckoutSessionUrl } from '../../../utils/urls';

export const handleStartCheckoutSessionForSubscription = async ({
    productId,
    meetingToken,
    baseUrl,
}: {
    productId: string;
    meetingToken: string;
    baseUrl: string;
}): Promise<{ url: string } | undefined> => {
    const response = await sendRequestWithCredentials<{ url: string }, ErrorState>({
        ...startCheckoutSessionUrl({ productId }),
        data: {
            meetingToken,
            baseUrl,
        },
    });

    if (response.success) {
        return response.result;
    }
};
