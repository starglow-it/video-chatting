import { EntityList, IMediaCategory } from 'shared-types';
import sendRequestWithCredentials from '../../../../../helpers/http/sendRequestWithCredentials';
import { getBackgroundCategories } from '../../../../../utils/urls';

export const handleGetCategories = async (): Promise<
    EntityList<IMediaCategory>
> => {
    const { result, success } = await sendRequestWithCredentials<
        EntityList<IMediaCategory>,
        void
    >({
        ...getBackgroundCategories({ skip: 0, limit: 0 }),
    });

    if (success && result) {
        return result;
    }
    if (!success) {
        return { list: [], count: 0 };
    }
    return { list: [], count: 0 };
};
