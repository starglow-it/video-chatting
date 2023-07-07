import { ErrorState } from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import {
    GetProfileTemplatesCountPayload,
    GetProfileTemplatesCountResponse,
} from '../types';
import { profileTemplatesCountUrl } from '../../../utils/urls';
import { ProfileTemplatesCountState } from '../../types';

export const handleFetchProfileTemplatesCount = async ({
    limit,
    skip,
    templateType,
}: GetProfileTemplatesCountPayload): Promise<ProfileTemplatesCountState> => {
    const response = await sendRequestWithCredentials<
        GetProfileTemplatesCountResponse,
        ErrorState
    >(profileTemplatesCountUrl({ limit, skip, templateType }));

    if (response.success) {
        return {
            state: response.result,
            error: null,
        };
    }

    if (!response.success) {
        return {
            state: {
                count: 0,
            },
            error: response.error,
        };
    }

    return {
        state: {
            count: 0,
        },
        error: null,
    };
};
