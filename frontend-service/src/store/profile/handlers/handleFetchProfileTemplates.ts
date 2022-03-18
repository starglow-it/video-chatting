import { EntityList, ErrorState, Template } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { profileTemplatesUrl } from '../../../utils/urls';
import { initialProfileTemplatesStore } from '../profileTemplates';

export const handleFetchProfileTemplates = async ({
    limit,
    skip,
}: {
    limit: number;
    skip: number;
    userId: string;
}): Promise<EntityList<Template>> => {
    const response = await sendRequestWithCredentials<EntityList<Template>, ErrorState>(profileTemplatesUrl({ limit, skip }));

    if (response.success) {
        return response.result;
    }

    return initialProfileTemplatesStore;
};
