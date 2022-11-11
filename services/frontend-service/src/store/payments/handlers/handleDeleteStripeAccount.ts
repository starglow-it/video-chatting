import { ErrorState } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { deleteStripeAccountUrl } from '../../../utils/urls';

export const handleDeleteStripeAccount = async (): Promise<void> => {
    await sendRequestWithCredentials<{ url: string }, ErrorState>(deleteStripeAccountUrl);
};
