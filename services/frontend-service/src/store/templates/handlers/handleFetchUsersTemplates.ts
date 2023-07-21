import { IUserTemplate, QueryParams } from 'shared-types';
import { EntityList, ErrorState } from '../../types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { usersTemplatesUrl } from '../../../utils/urls';

const handleFetchUsersTemplates = async ({
    limit,
    skip,
}: QueryParams): Promise<EntityList<IUserTemplate> | undefined | null> => {
    const response = await sendRequestWithCredentials<
        EntityList<IUserTemplate>,
        ErrorState
    >(usersTemplatesUrl({ skip, limit }));

    if (!response.success) {
        return response.result;
    }

    return response.result;
};

export { handleFetchUsersTemplates };
