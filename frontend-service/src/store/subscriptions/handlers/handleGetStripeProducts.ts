import sendRequestWithCredentials from "../../../helpers/http/sendRequestWithCredentials";
import { ErrorState } from "../../types";
import { getProductsUrl } from "../../../utils/urls";

export const handleGetStripeProducts = async () => {
    const response = await sendRequestWithCredentials<any, ErrorState>(
        getProductsUrl,
    );

    if (response.success) {
        return response.result;
    }

    return;
}