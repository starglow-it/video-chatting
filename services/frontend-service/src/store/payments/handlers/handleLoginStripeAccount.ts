import { ErrorState } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { loginStripeAccountUrl } from '../../../utils/urls';

export const handleLoginStripeAccount = async () => {
    const response = await sendRequestWithCredentials<
        { url: string },
        ErrorState
    >(loginStripeAccountUrl);

    if (response.success) {
        return response.result;
    }
};
