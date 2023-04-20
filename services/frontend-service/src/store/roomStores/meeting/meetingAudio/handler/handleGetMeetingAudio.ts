import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { IAudioCategory } from '../types';
import { EntityList, MediaCategoryType } from 'shared-types';
import { getBackgroundCategories } from 'src/utils/urls';

export const handleGetMeetingAudio = async ({
    type = MediaCategoryType.Sound,
    userTemplateId,
}: {
    type?: MediaCategoryType;
    userTemplateId: string;
}): Promise<EntityList<IAudioCategory>> => {
    const { result, success } = await sendRequestWithCredentials<
        EntityList<IAudioCategory>,
        void
    >({
        ...getBackgroundCategories({
            skip: 0,
            limit: 12,
            type,
            userTemplateId,
        }),
    });

    if (success && result) {
        const newList = [...result.list];
        const index = newList.findIndex(img => img.key === 'classical');
        if (index > -1) newList.unshift(newList.splice(index, 1)[0]);
        return { ...result, list: newList };
    }
    if (!success) {
        return { list: [], count: 0 };
    }
    return { list: [], count: 0 };
};
