import sendRequestWithCredentials from '../../../helpers/http/sendRequestWithCredentials';
import { ErrorState, INextPageContext } from '../../types';
import { getSeatProductsUrl } from '../../../utils/urls';
import { ProductsStore } from '../products/types';

export const handleGetStripeSeatProducts = async ({
    ctx,
}: Partial<INextPageContext> = {}): Promise<ProductsStore> => {
    const response = await sendRequestWithCredentials<
        ProductsStore,
        ErrorState
    >({
        ...getSeatProductsUrl,
        ...(ctx ? { authRequest: true, ctx } : {}),
    });

    if (response.success) {
        return response.result;
    }

    return [];
};
