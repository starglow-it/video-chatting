import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState } from '../../types';
import { startCheckoutSessionUrl } from '../../../utils/urls';
import { GetCheckoutSessionUrlPayload, GetCheckoutSessionUrlResponse } from '../products/types';

export const handleStartCheckoutSessionForSubscription = async ({
    productId,
    meetingToken,
    baseUrl,
}: GetCheckoutSessionUrlPayload): Promise<GetCheckoutSessionUrlResponse> => {
    const response = await sendRequestWithCredentials<GetCheckoutSessionUrlResponse, ErrorState>({
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
