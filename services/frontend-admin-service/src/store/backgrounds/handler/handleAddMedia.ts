import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { addMediaUrl } from 'src/const/urls/backgrounds';
import { ErrorState } from 'shared-types';
import { UploadMediaParams } from '../types';

export const handleAddMedia = async (
    params: UploadMediaParams,
): Promise<boolean> => {
    const response = await sendRequestWithCredentials<void, ErrorState>({
        ...addMediaUrl,
        data: params,
    });

    return response.success;
};
