import { connectStripeAccountUrl } from 'src/utils/urls/payments';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState } from '../../types';

export const handleConnectStripeAccount = async (): Promise<{ url: string } | undefined> => {
    const response = await sendRequestWithCredentials<{ url: string }, ErrorState>(
        connectStripeAccountUrl,
    );

    if (response.success) {
        return response.result;
    }

    return;
};
