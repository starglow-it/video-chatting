import sendRequestWithCredentials from '../../../../../helpers/http/sendRequestWithCredentials';
import { ErrorState } from '../../../../types';
import { getSFUTokenUrl } from '../../../../../utils/urls';
import { GetLiveKitTokenPayload } from '../../types';

export const handleGetLiveKitToken = async ({
    templateId,
    userId,
}: GetLiveKitTokenPayload): Promise<string> => {
    console.log('handleGetLiveKitToken')
    const response = await sendRequestWithCredentials<string, ErrorState>({
        ...getSFUTokenUrl,
        data: {
            templateId,
            userId,
        },
    });

    if (response.success) {
        return response.result;
    }

    return '';
};
