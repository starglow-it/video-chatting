import { generateFormData } from 'shared-utils';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { uploadBackgroundToCategory } from 'src/utils/urls';
import { IMediaItem, UploadBackgroundPayload } from '../types';

export const handleUploadNewBackground = async (
    payload: UploadBackgroundPayload,
): Promise<IMediaItem | null> => {
    const formData = generateFormData(payload);
    const { success, result } = await sendRequestWithCredentials<
    IMediaItem | null,
        void
    >({
        ...uploadBackgroundToCategory(),
        data: formData,
    });

    if (success && result) {
        return result;
    }
    return null;
};
