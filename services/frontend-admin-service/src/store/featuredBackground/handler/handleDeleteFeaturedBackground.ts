import { deleteFeaturedBackgroundUrl } from 'src/const/urls/featuredBackground';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';

export const handleDeleteFeaturedBackground = async (
    id: string,
): Promise<void> => {
    await sendRequestWithCredentials<void, void>({
        ...deleteFeaturedBackgroundUrl(id),
    });
};
