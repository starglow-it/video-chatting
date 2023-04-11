import { EntityList } from 'shared-types';
import sendRequestWithCredentials from '../../../../../helpers/http/sendRequestWithCredentials';
import { getMediasCategory } from '../../../../../utils/urls';
import { IMediaItem } from '../types';

export const handleGetBackgroundMeeting = async ({
    id,
    skip,
    limit,
}: {
    id: string;
    skip?: number;
    limit?: number;
}): Promise<EntityList<IMediaItem> & { isReset: boolean }> => {
    const { result, success } = await sendRequestWithCredentials<
        EntityList<IMediaItem>,
        void
    >({
        ...getMediasCategory({ categoryId: id, skip, limit }),
    });

    if (success && result) {
        return { ...result, isReset: !skip };
    }
    if (!success) {
        return { list: [], count: 0, isReset: !skip };
    }
    return { list: [], count: 0, isReset: !skip };
};
