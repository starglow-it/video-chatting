import { ErrorState, IUserTemplate } from 'shared-types';
import sendRequestWithCredentials from '../../../../../helpers/http/sendRequestWithCredentials';
import { createIntentUrl } from '../../../../../utils/urls';

export const handleCreatePaymentIntent = async (data: {
    templateId: IUserTemplate['id'];
}) => {
    console.log(data);
    const response = await sendRequestWithCredentials<
        { paymentIntent: { clientSecret: string; id: string } },
        ErrorState
    >({ ...createIntentUrl, data });

    if (response.result) {
        return {
            id: response.result.paymentIntent.id,
            clientSecret: response.result.paymentIntent.clientSecret,
        };
    }

    return {
        id: '',
        clientSecret: '',
    };
};
