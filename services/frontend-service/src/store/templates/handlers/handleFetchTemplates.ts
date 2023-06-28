import { ErrorState, ICommonTemplate, QueryParams } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getTemplatesUrl } from '../../../utils/urls';
import { EntityList } from '../../types';
import { ResultGetTemplates } from '../types';

const handleFetchTemplates = async (
    payload: QueryParams,
): Promise<ResultGetTemplates> => {
    const { success, result } = await sendRequestWithCredentials<
        EntityList<ICommonTemplate>,
        ErrorState
    >(getTemplatesUrl(payload));

    const isReset = !payload.skip;

    if (success) {
        return {
            list: result?.list || [],
            count: result?.count || 0,
            isReset,
            skip: payload.skip,
        };
    }
    if (!success) {
        return { list: [], count: 0, isReset, skip: payload.skip };
    }
};

export { handleFetchTemplates };
