import sendRequestWithCredentials from "../../../helpers/http/sendRequestWithCredentials";
import {ErrorState} from "../../types";
import { startCheckoutSessionUrl } from "../../../utils/urls";

export const handleStartCheckoutSessionForSubscription = async ({ productId, meetingToken }: { productId: string; meetingToken: string; }): Promise<{ url: string } | undefined> => {
    const response = await sendRequestWithCredentials<{ url: string }, ErrorState>({
        ...startCheckoutSessionUrl({ productId, meetingToken }),
    });

    if (response.success) {
        return response.result;
    }

    return;
}