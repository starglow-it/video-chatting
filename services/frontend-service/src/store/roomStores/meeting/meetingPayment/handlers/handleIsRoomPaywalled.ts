import { ErrorState, IUserTemplate } from 'shared-types';
import sendRequestWithCredentials from '../../../../../helpers/http/sendRequestWithCredentials';
import { isRoomPaywalledUrl } from '../../../../../utils/urls';

export const handleIsRoomPaywalled = async (data: {
    templateId: IUserTemplate['id'];
}) => {
    const response = await sendRequestWithCredentials<
        { paymentIntent: { clientSecret: string; id: string } },
        ErrorState
    >({ ...isRoomPaywalledUrl, data });

    if (response.result) {
        return { ...response.result };
    }

    return {
        isRoomPaywalled: false
    };
};
