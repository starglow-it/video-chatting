import { ErrorState } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { profileTemplatesUrl } from '../../../utils/urls';
import { initialProfileTemplatesStore } from '../profileTemplates/const';
import { GetProfileTemplatesPayload, GetProfileTemplatesResponse } from '../types';

export const handleFetchProfileTemplates = async ({
    limit,
    skip,
    businessCategories
}: GetProfileTemplatesPayload): Promise<GetProfileTemplatesResponse> => {
    const response = await sendRequestWithCredentials<GetProfileTemplatesResponse, ErrorState>(
        profileTemplatesUrl({ limit, skip, businessCategories }),
    );

    if (response.success) {
        return response.result;
    }

    return initialProfileTemplatesStore;
};
