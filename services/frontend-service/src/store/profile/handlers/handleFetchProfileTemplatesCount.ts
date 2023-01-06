import { ErrorState } from 'shared-types';

import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { GetProfileTemplatesCountPayload, GetProfileTemplatesCountResponse } from '../types';
import { ProfileTemplatesCountState } from '../../types';
import {profileApiMethods} from "../../../utils/urls";

export const handleFetchProfileTemplatesCount = async ({
    limit,
    skip,
    templateType,
}: GetProfileTemplatesCountPayload): Promise<ProfileTemplatesCountState> => {
    const profileTemplatesCountUrl = profileApiMethods.profileTemplatesCountUrl({ limit, skip, templateType });

    const response = await sendRequestWithCredentials<GetProfileTemplatesCountResponse, ErrorState>(
        profileTemplatesCountUrl,
    );

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
