import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { EntityList, ErrorState } from '../../types';
import { getBusinessCategoriesUrl } from '../../../utils/urls';
import { IBusinessCategory } from 'shared-types';

export const handleGetBusinessCategories = async ({
    limit,
    skip,
}: {
    limit: number;
    skip: number;
}): Promise<EntityList<IBusinessCategory> | undefined | null> => {
    const response = await sendRequestWithCredentials<EntityList<IBusinessCategory>, ErrorState>(
        getBusinessCategoriesUrl({
            limit,
            skip,
        }),
    );

    if (response.success) {
        return response.result;
    }
    if (!response.success) {
        return response.result;
    }
};
