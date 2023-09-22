import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { GetMediasParams, ResultGetCategories } from '../types';
import { EntityList, ErrorState } from 'shared-types';
import { getMediasUrl } from 'src/const/urls/backgrounds';

export const handleGetMedias = async ({
    categoryId = '',
    skip = 0,
    limit = 0,
}: GetMediasParams): Promise<ResultGetCategories> => {
    const { success, result } = await sendRequestWithCredentials<
        ResultGetCategories,
        ErrorState
    >(getMediasUrl({ categoryId, skip, limit }));

    const isReset = skip === 0;

    if (success && result) {
        return { ...result, isReset };
    }

    if (!success) {
        return {
            list: [],
            count: 0,
            isReset,
        };
    }

    return {
        list: [],
        count: 0,
        isReset,
    };
};
