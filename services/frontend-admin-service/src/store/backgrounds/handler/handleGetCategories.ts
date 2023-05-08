import { EntityList, ErrorState } from 'shared-types';
import { getCategoriesUrl } from 'src/const/urls/backgrounds';
import sendRequestWithCredentials from 'src/helpers/http/sendRequestWithCredentials';
import { IBackgroundCategory } from '../types';

export const handleGetCategories = async (): Promise<
    EntityList<IBackgroundCategory>
> => {
    const response = await sendRequestWithCredentials<
        EntityList<IBackgroundCategory>,
        ErrorState
    >(getCategoriesUrl({ type: 'background' }));

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
