import { EntityList, ICommonTemplate, QueryParams } from 'shared-types';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { getTemplatesUrl } from 'src/utils/urls';

export const handleGetFeaturedBackground = async (
    payload: QueryParams,
): Promise<EntityList<ICommonTemplate>> => {
    const { success, result } = await sendRequestWithCredentials<
        EntityList<ICommonTemplate>,
        void
    >({
        ...getTemplatesUrl(payload),
    });

    console.log('payload, success, result: ', payload, success, result);

    if (success) return { list: result?.list || [], count: result?.count || 0 };
    return { list: [], count: 0 };
};
