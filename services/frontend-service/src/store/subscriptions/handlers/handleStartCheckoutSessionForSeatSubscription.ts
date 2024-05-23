import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState } from '../../types';
import { startCheckoutSeatSessionUrl } from '../../../utils/urls';
import {
    GetCheckoutSessionUrlPayload,
    GetCheckoutSessionUrlResponse,
} from '../products/types';

export const handleStartCheckoutSessionForSeatSubscription = async ({
    productId,
    meetingToken,
    baseUrl,
    cancelUrl,
    withTrial,
}: GetCheckoutSessionUrlPayload): Promise<GetCheckoutSessionUrlResponse> => {
    const response = await sendRequestWithCredentials<
        GetCheckoutSessionUrlResponse,
        ErrorState
    >({
        ...startCheckoutSeatSessionUrl({ productId }),
        data: {
            meetingToken,
            baseUrl,
            cancelUrl,
            withTrial,
        },
    });

    if (response.success) {
        return response.result;
    }
};
