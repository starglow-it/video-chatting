import {createIntentUrl} from "../../../utils/urls";
import sendRequestWithCredentials from "../../../helpers/http/sendRequestWithCredentials";
import {ErrorState, UserTemplate} from "../../types";

export const handleCreatePaymentIntent = async (data: { templateId: UserTemplate["id"] }) => {
    const response = await sendRequestWithCredentials<{ paymentIntent: { clientSecret: string; id: string } }, ErrorState>({ ...createIntentUrl, data });

    if (response.result) {
        return {
            id: response.result.paymentIntent.id,
            clientSecret: response.result.paymentIntent.clientSecret
        };
    }

    return {
        id: '',
        clientSecret: '',
    }
}