import sendRequestWithCredentials from "../../../helpers/http/sendRequestWithCredentials";
import {ErrorState} from "../../types";
import { getCustomerPortalSessionUrl } from "../../../utils/urls";

export const handleGetCustomerPortalSessionUrl = async ({ subscriptionId }: { subscriptionId: string }) => {
    const response = await sendRequestWithCredentials<any, ErrorState>(
        getCustomerPortalSessionUrl({ subscriptionId }),
    );

    if (response.success) {
        return response.result;
    }

    return;
}