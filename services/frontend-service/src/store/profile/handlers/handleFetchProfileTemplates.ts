import { EntityList, ErrorState, UserTemplate } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { profileTemplatesUrl } from '../../../utils/urls';
import { initialProfileTemplatesStore } from '../profileTemplates/const';

export const handleFetchProfileTemplates = async ({
    limit,
    skip,
}: {
    limit: number;
    skip: number;
    userId: string;
}): Promise<EntityList<UserTemplate>> => {
    const response = await sendRequestWithCredentials<EntityList<UserTemplate>, ErrorState>(
        profileTemplatesUrl({ limit, skip }),
    );

    if (response.success) {
        console.log(response.result);
        return response.result;
    }

    return initialProfileTemplatesStore;
};
