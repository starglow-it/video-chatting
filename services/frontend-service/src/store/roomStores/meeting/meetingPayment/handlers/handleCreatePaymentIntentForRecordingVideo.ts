import { ErrorState, ICommonUser } from 'shared-types';
import sendRequestWithCredentials from '../../../../../helpers/http/sendRequestWithCredentials';
import { createIntentUrlForRecordingVideo } from '../../../../../utils/urls';

export const handleCreatePaymentIntentForRecordingVideo = async (data: {
    userId: ICommonUser['id'];
    price: number;
}) => {
    const response = await sendRequestWithCredentials<
        { paymentIntent: { clientSecret: string; id: string } },
        ErrorState
    >({ ...createIntentUrlForRecordingVideo, data });

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
