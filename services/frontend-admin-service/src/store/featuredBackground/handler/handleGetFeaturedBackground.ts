import { EntityList, IFeaturedBackground, QueryParams } from 'shared-types';
import { getFeaturedBackgroundUrl } from 'src/const/urls/featuredBackground';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';

export const handleGetFeaturedBackground = async (
    payload: QueryParams,
): Promise<EntityList<IFeaturedBackground>> => {
    const { success, result } = await sendRequestWithCredentials<
        EntityList<IFeaturedBackground>,
        void
    >({
        ...getFeaturedBackgroundUrl(payload),
    });

    if (success) return { list: result?.list || [], count: result?.count || 0 };
    return { list: [], count: 0 };
};
