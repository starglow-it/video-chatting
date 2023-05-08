import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import {
    GetMediasParams,
    IBackgroundCategory,
    IBackgroundMedia,
} from '../types';
import { EntityList, ErrorState } from 'shared-types';
import { getMediasUrl } from 'src/const/urls/backgrounds';

export const handleGetMedias = async ({
    categoryId = '',
    skip = 0,
    limit = 0,
}: GetMediasParams): Promise<EntityList<IBackgroundMedia>> => {
    const response = await sendRequestWithCredentials<
        EntityList<IBackgroundMedia>,
        ErrorState
    >(getMediasUrl({ categoryId, skip, limit }));

    if (response.success && response.result) {
        return response.result;
    }

    if (!response.success) {
        return {
            list: [],
            count: 0,
        };
    }

    return {
        list: [],
        count: 0,
    };
};
