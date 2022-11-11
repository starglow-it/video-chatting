import { connectStripeAccountUrl } from 'src/utils/urls/payments';
import { ErrorState } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';

export const handleConnectStripeAccount = async (): Promise<{ url: string } | undefined> => {
    const response = await sendRequestWithCredentials<{ url: string }, ErrorState>(
        connectStripeAccountUrl,
    );

    if (response.success) {
        return response.result;
    }
};
