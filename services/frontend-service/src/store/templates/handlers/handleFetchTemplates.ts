import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getTemplatesUrl } from '../../../utils/urls';
import { EntityList } from '../../types';

import { ErrorState, ICommonTemplate } from 'shared-types';

const handleFetchTemplates = async ({
    limit,
    skip,
}: {
    limit: number;
    skip: number;
}): Promise<EntityList<ICommonTemplate> | undefined | null> => {
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
