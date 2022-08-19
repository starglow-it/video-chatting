import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState } from '../../types';
import { getProductsUrl } from '../../../utils/urls';
import { ProductsStore } from '../products/types';

export const handleGetStripeProducts = async (): Promise<ProductsStore> => {
    const response = await sendRequestWithCredentials<ProductsStore, ErrorState>(getProductsUrl);

    if (response.success) {
        return response.result;
    }

    return [];
};
