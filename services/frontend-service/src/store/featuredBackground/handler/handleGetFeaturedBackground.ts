import { EntityList, IFeaturedBackground, QueryParams } from 'shared-types';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { getFeatruedBackgroundUrl } from 'src/utils/urls';

export const handleGetFeaturedBackground = async (
    payload: QueryParams,
): Promise<EntityList<IFeaturedBackground>> => {
    const { success, result } = await sendRequestWithCredentials<
        EntityList<IFeaturedBackground>,
        void
    >({
        ...getFeatruedBackgroundUrl(payload),
    });

    if (success) return { list: result?.list || [], count: result?.count || 0 };
    return { list: [], count: 0 };
};
