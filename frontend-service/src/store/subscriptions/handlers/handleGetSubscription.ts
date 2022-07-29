import sendRequestWithCredentials from "../../../helpers/http/sendRequestWithCredentials";
import { ErrorState } from "../../types";
import { getSubscriptionUrl } from "../../../utils/urls";

export const handleGetSubscription = async ({ subscriptionId }: { subscriptionId: string }) => {
    if (subscriptionId) {
        const response = await sendRequestWithCredentials<any, ErrorState>({
            ...getSubscriptionUrl({ subscriptionId }),
        });

        if (response.success) {
            return response.result;
        }
    }

    return;
}