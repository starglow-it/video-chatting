import { ErrorState, ICommonTemplate, QueryParams } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getTemplatesUrl } from '../../../utils/urls';
import { EntityList } from '../../types';

const handleFetchTemplates = async ({
    limit,
    skip,
}: QueryParams): Promise<EntityList<ICommonTemplate> | undefined | null> => {
    const response = await sendRequestWithCredentials<EntityList<ICommonTemplate>, ErrorState>(
        getTemplatesUrl({
            limit,
            skip,
        }),
    );

    if (response.success) {
        return response.result;
    }
    if (!response.success) {
        return response.result;
    }
};

export { handleFetchTemplates };
