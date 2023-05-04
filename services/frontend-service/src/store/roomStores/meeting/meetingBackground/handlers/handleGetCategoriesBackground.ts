import { EntityList, IMediaCategory } from 'shared-types';
import sendRequestWithCredentials from '../../../../../helpers/http/sendRequestWithCredentials';
import { getBackgroundCategories } from '../../../../../utils/urls';

export const handleGetCategories = async ({
    userTemplateId,
}: {
    userTemplateId: string;
}): Promise<EntityList<IMediaCategory>> => {
    const { result, success } = await sendRequestWithCredentials<
        EntityList<IMediaCategory>,
        void
    >({
        ...getBackgroundCategories({ skip: 0, limit: 12, userTemplateId }),
    });

    if (success && result) {
        const newList = [...result.list];
        const addLastItem = (index: number) => {
            if (index > -1) newList.push(newList.splice(index, 1)[0]);
        };
        const indexMore = newList.findIndex(img => img.key === 'more');
        addLastItem(indexMore);

        const indexMyRooms = newList.findIndex(img => img.key === 'myrooms');
        addLastItem(indexMyRooms);
        return { ...result, list: newList };
    }
    if (!success) {
        return { list: [], count: 0 };
    }
    return { list: [], count: 0 };
};
