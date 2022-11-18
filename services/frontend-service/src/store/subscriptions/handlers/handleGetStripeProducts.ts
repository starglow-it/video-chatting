import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState, INextPageContext } from '../../types';
import { getProductsUrl } from '../../../utils/urls';
import { ProductsStore } from '../products/types';

export const handleGetStripeProducts = async ({ ctx }: Partial<INextPageContext> = {}): Promise<ProductsStore> => {
    const response = await sendRequestWithCredentials<ProductsStore, ErrorState>({
        ...getProductsUrl,
        ...(ctx ? { authRequest: true, ctx } : {}),
    });

    if (response.success) {
        return response.result;
    }

    return [];
};
