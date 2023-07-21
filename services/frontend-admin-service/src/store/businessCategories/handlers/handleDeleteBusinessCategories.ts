import { BusinessCategoryList, ErrorState } from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getUrlDeleteBusiness } from '../../../const/urls/businessCategories';

export const handleDeleteBusinessCategories = async (
    ids: string[],
): Promise<void> => {
    await sendRequestWithCredentials<BusinessCategoryList, ErrorState>({
        ...getUrlDeleteBusiness(),
        data: { ids },
    });
};
