import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { addMediaUrl } from 'src/const/urls/backgrounds';
import { ErrorState } from 'shared-types';
import { UploadMediaParams } from '../types';
import { generateFormData } from 'shared-utils';

export const handleAddMedia = async (
    params: UploadMediaParams,
): Promise<boolean> => {
    const formData = generateFormData(params);
    const response = await sendRequestWithCredentials<void, ErrorState>({
        ...addMediaUrl,
        data: formData,
    });

    return response.success;
};
