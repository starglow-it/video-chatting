import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { addMediaUrl } from 'src/const/urls/backgrounds';
import { ErrorState } from 'shared-types';
import { generateFormData } from 'shared-utils';
import { ResultActionBackground, UploadMediaParams } from '../types';

export const handleAddMedia = async (
    params: UploadMediaParams,
): Promise<ResultActionBackground> => {
    const formData = generateFormData(params);
    const { success } = await sendRequestWithCredentials<void, ErrorState>({
        ...addMediaUrl,
        data: formData,
    });

    return {
        success,
        message: success
            ? 'backgrounds.addMediaSuccess'
            : 'backgrounds.addMediaFail',
    };
};
