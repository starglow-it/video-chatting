import { ErrorState, ICommonTemplate, QueryParams } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { templatesApiMethods } from '../../../utils/urls';
import { EntityList } from '../../types';

const handleFetchTemplates = async (
    payload: QueryParams,
): Promise<EntityList<ICommonTemplate>> => {
    const getTemplatesUrl = templatesApiMethods.getTemplatesUrl(payload);

    const response = await sendRequestWithCredentials<EntityList<ICommonTemplate>, ErrorState>(
        getTemplatesUrl,
    );

    if (response.success && response.result) {
        return response.result;
    }

    return {
        list: [],
        count: 0
    };
};

export { handleFetchTemplates };
