import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState } from 'shared-types';
import { deleteStripeAccountUrl } from '../../../utils/urls';

export const handleDeleteStripeAccount = async (): Promise<void> => {
    await sendRequestWithCredentials<{ url: string }, ErrorState>(deleteStripeAccountUrl);
};
