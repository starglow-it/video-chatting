import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState } from '../../types';
import { getCustomerPortalSessionUrl } from '../../../utils/urls';
import {
    GetPortalSessionUrlPayload,
    GetPortalSessionUrlResponse,
} from '../products/types';

export const handleGetCustomerPortalSessionUrl = async ({
    subscriptionId,
}: GetPortalSessionUrlPayload) => {
    const response = await sendRequestWithCredentials<
        GetPortalSessionUrlResponse,
        ErrorState
    >(getCustomerPortalSessionUrl({ subscriptionId }));

    if (response.success) {
        return response.result;
    }
};
