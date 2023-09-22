import {
    BusinessCategoryList,
    ErrorState,
    IBusinessCategory,
} from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getUrlAddBusiness } from '../../../const/urls/businessCategories';

export const handleAddBusinessCategories = async (
    data: IBusinessCategory,
): Promise<void> => {
    await sendRequestWithCredentials<BusinessCategoryList, ErrorState>({
        ...getUrlAddBusiness(),
        data,
    });
};
