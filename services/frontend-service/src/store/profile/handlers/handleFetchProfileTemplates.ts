import { ErrorState } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { profileTemplatesUrl } from '../../../utils/urls';
import { initialProfileTemplatesStore } from '../profileTemplates/const';
import {
    GetProfileTemplatesPayload,
    GetProfileTemplatesResponse,
} from '../types';

export const handleFetchProfileTemplates = async ({
    limit,
    skip,
}: GetProfileTemplatesPayload): Promise<GetProfileTemplatesResponse> => {
    const { result, success } = await sendRequestWithCredentials<
        GetProfileTemplatesResponse,
        ErrorState
    >(profileTemplatesUrl({ limit, skip }));

    if (success) {
        return {
            list: result?.list || [],
            count: result?.count || 0,
            isReset: !skip,
        };
    }

    return { ...initialProfileTemplatesStore, isReset: true };
};
