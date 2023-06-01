import { generateFormData } from 'shared-utils';
import { createFeaturedBackgroundUrl } from 'src/const/urls/featuredBackground';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';

export const handleCreateFeaturedBackground = async (
    file: File,
): Promise<void> => {
    await sendRequestWithCredentials<void, void>({
        ...createFeaturedBackgroundUrl,
        data: generateFormData({
            file,
        }),
    });
};
