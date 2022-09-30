import { cancelIntentUrl } from '../../../utils/urls';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

export const handleCancelPaymentIntent = async (data: { paymentIntentId: string }) => {
    const response = await sendRequestWithCredentials<void, void>({ ...cancelIntentUrl, data });

    if (response.result) {
        return {
            clientSecret: '',
            id: '',
        };
    }
};
