import { IBusinessCategory, QueryParams } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { EntityList, ErrorState } from '../../types';
import { getBusinessCategoriesUrl } from '../../../utils/urls';

export const handleGetBusinessCategories = async ({
    limit,
    skip,
}: QueryParams): Promise<EntityList<IBusinessCategory> | undefined | null> => {
    const response = await sendRequestWithCredentials<
        EntityList<IBusinessCategory>,
        ErrorState
    >(
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
