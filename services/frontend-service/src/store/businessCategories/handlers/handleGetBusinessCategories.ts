import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { BusinessCategory, EntityList, ErrorState } from '../../types';
import { getBusinessCategoriesUrl } from '../../../utils/urls';

export const handleGetBusinessCategories = async ({
    limit,
    skip,
}: {
    limit: number;
    skip: number;
}): Promise<EntityList<BusinessCategory> | undefined | null> => {
    const response = await sendRequestWithCredentials<EntityList<BusinessCategory>, ErrorState>(
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
