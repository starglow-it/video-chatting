import { deleteCommonTemplateUrl } from 'src/const/urls/templates';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';

export const handleDeleteFeaturedBackground = async (
    id: string,
): Promise<void> => {
    await sendRequestWithCredentials<void, void>({
        ...deleteCommonTemplateUrl({ templateId: id }),
    });
};
