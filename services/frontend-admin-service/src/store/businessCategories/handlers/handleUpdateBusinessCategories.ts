import {
    BusinessCategoryList,
    ErrorState,
    IBusinessCategory,
} from 'shared-types';
import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { getUrlUpdateBusiness } from '../../../const/urls/businessCategories';

export const handleUpdateBusinessCategories = async (
    data: IBusinessCategory & { id: string },
): Promise<void> => {
    const newData = { ...data } as any;
    delete newData?.id;
    await sendRequestWithCredentials<BusinessCategoryList, ErrorState>({
        ...getUrlUpdateBusiness(data.id),
        data: newData,
    });
};
