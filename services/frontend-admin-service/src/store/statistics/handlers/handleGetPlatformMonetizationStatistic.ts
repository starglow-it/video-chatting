import { ErrorState } from 'shared-types';
import { sendRequest } from '../../../helpers/http/sendRequest';
import { monetizationStatisticUrl } from '../../../const/urls/statistics';
import {
    GetMonetizationStatisticParams,
    MonetizationStatisticResponse,
    MonetizationStatisticState,
} from '../../types';

export const handleGetPlatformMonetizationStatistic = async (
    payload: GetMonetizationStatisticParams,
): Promise<MonetizationStatisticState> => {
    const response = await sendRequest<
        MonetizationStatisticResponse,
        ErrorState
    >(monetizationStatisticUrl(payload));

    if (response.success && response.result) {
        return {
            state: response.result,
            error: null,
        };
    }

    if (!response.success) {
        return {
            state: {
                totalNumber: 0,
                data: [],
            },
            error: response.error,
        };
    }

    return {
        state: {
            totalNumber: 0,
            data: [],
        },
        error: null,
    };
};
