import { EntityList } from 'shared-types';
import sendRequestWithCredentials from '../../../../../helpers/http/sendRequestWithCredentials';
import { getMediasCategory } from '../../../../../utils/urls';
import { ICategoryMedia } from '../types';

export const handleGetBackgroundMeeting = async ({
    id,
}: {
    id: string;
}): Promise<ICategoryMedia[]> => {
    const { result, success } = await sendRequestWithCredentials<
        EntityList<ICategoryMedia>,
        void
    >({
        ...getMediasCategory({ categoryId: id }),
    });

    if (success && result) {
        return result.list ?? [];
    }
    if (!success) {
        return [];
    }
    return [];
};
