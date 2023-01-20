import { ErrorState, ICommonTemplate, QueryParams } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getTemplatesUrl } from '../../../utils/urls';
import { EntityList } from '../../types';

const handleFetchTemplates = async (
    payload: QueryParams,
): Promise<EntityList<ICommonTemplate>> => {
    const response = await sendRequestWithCredentials<EntityList<ICommonTemplate>, ErrorState>(
        getTemplatesUrl(payload),
    );

    if (response.success) {
        return response.result;
    }
    if (!response.success) {
        return response.result;
    }
};

export { handleFetchTemplates };
