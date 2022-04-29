import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getTemplatesUrl } from '../../../utils/urls';
import { EntityList, Template, ErrorState } from '../../types';

const handleFetchTemplates = async ({
    limit,
    skip,
}: {
    limit: number;
    skip: number;
}): Promise<EntityList<Template> | undefined | null> => {
    const response = await sendRequestWithCredentials<EntityList<Template>, ErrorState>(
        getTemplatesUrl({
            limit,
            skip,
        }),
    );

    if (response.success) {
        return response.result;
    } else if (!response.success) {
        return response.result;
    }
};

export { handleFetchTemplates };
