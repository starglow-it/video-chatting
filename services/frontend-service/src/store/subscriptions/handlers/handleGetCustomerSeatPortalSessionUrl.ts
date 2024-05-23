import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState } from '../../types';
import { getCustomerSeatPortalSessionUrl } from '../../../utils/urls';
import {
    GetPortalSessionUrlPayload,
    GetPortalSessionUrlResponse,
} from '../products/types';

export const handleGetCustomerSeatPortalSessionUrl = async ({
    subscriptionId,
}: GetPortalSessionUrlPayload) => {
    const response = await sendRequestWithCredentials<
        GetPortalSessionUrlResponse,
        ErrorState
    >(getCustomerSeatPortalSessionUrl({ subscriptionId }));

    if (response.success) {
        return response.result;
    }
};
