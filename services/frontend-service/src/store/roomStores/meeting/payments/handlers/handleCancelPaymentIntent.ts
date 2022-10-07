import sendRequestWithCredentials from '../../../../../helpers/http/sendRequestWithCredentials';
import { cancelIntentUrl } from '../../../../../utils/urls';

export const handleCancelPaymentIntent = async (data: {
    paymentIntentId: string;
}): Promise<void> => {
    await sendRequestWithCredentials<void, void>({ ...cancelIntentUrl, data });
};
